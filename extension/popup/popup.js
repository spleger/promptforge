// API Configuration
const API_URL = 'https://promptforge.vercel.app/api/enhance';

// DOM Elements
const promptInput = document.getElementById('promptInput');
const modelSelect = document.getElementById('modelSelect');
const levelSelect = document.getElementById('levelSelect');
const enhanceBtn = document.getElementById('enhanceBtn');
const loadingState = document.getElementById('loadingState');
const resultSection = document.getElementById('resultSection');
const originalReview = document.getElementById('originalReview');
const enhancedReview = document.getElementById('enhancedReview');
const errorState = document.getElementById('errorState');
const errorMessage = document.getElementById('errorMessage');
const copyPromptBtn = document.getElementById('copyPromptBtn');
const copyReviewsBtn = document.getElementById('copyReviewsBtn');
const settingsBtn = document.getElementById('settingsBtn');
const historyLink = document.getElementById('historyLink');

// Load saved settings
chrome.storage.sync.get(['defaultModel', 'defaultLevel'], (result) => {
  if (result.defaultModel) {
    modelSelect.value = result.defaultModel;
  }
  if (result.defaultLevel) {
    levelSelect.value = result.defaultLevel;
  }
});

// Check if there's selected text on the page
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs[0]) {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'getSelectedText' }, (response) => {
      // Ignore chrome.runtime.lastError (happens on chrome:// pages or when content script isn't ready)
      if (chrome.runtime.lastError) {
        // Silently ignore - content script not available on this page
        return;
      }
      if (response && response.text) {
        promptInput.value = response.text;
        promptInput.focus();
      }
    });
  }
});

// Enhance button click handler
enhanceBtn.addEventListener('click', async () => {
  const prompt = promptInput.value.trim();

  if (!prompt) {
    showError('Please enter a prompt to enhance');
    return;
  }

  if (prompt.length < 3) {
    showError('Prompt must be at least 3 characters');
    return;
  }

  if (prompt.length > 2000) {
    showError('Prompt must not exceed 2000 characters');
    return;
  }

  await enhancePrompt(prompt);
});

// Enter key to enhance
promptInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    enhanceBtn.click();
  }
});

// Enhance prompt function
async function enhancePrompt(prompt) {
  try {
    // Show loading state
    enhanceBtn.disabled = true;
    loadingState.classList.remove('hidden');
    resultSection.classList.add('hidden');
    errorState.classList.add('hidden');

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: prompt,
        targetModel: modelSelect.value,
        enhancementLevel: levelSelect.value,
      }),
    });

    if (!response.ok) {
      let errorMessage = 'Enhancement failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        // If JSON parsing fails, try to get text
        try {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        } catch (e2) {
          // Use default error message
        }
      }
      throw new Error(errorMessage);
    }

    // Read the streaming response
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;
      }
    } catch (streamError) {
      console.warn('Streaming error:', streamError);
      // Continue with whatever we received
    }

    console.log('Full response received:', fullResponse.substring(0, 200) + '...');

    // Parse the enhanced prompt from the response
    const parsedResponse = parseEnhancedPrompt(fullResponse);

    if (!parsedResponse.enhanced) {
      console.error('Failed to parse response:', fullResponse);
      throw new Error('Could not parse enhanced prompt. Please try again.');
    }

    console.log('Parsed successfully:', parsedResponse.enhanced.substring(0, 100) + '...');

    // Show result
    originalReview.textContent = parsedResponse.original || prompt;
    enhancedReview.textContent = parsedResponse.enhanced;
    resultSection.classList.remove('hidden');
    loadingState.classList.add('hidden');

    // Store for copy actions
    window.lastEnhancedPrompt = parsedResponse.enhanced;
    window.lastOriginalPrompt = parsedResponse.original || prompt;

    // Save to history
    saveToHistory(prompt, parsedResponse.enhanced);

  } catch (error) {
    showError(error.message || 'Failed to enhance prompt');
  } finally {
    enhanceBtn.disabled = false;
  }
}

// Parse enhanced prompt from streaming response
function parseEnhancedPrompt(response) {
  try {
    // Handle streaming format - data might be in chunks with "0:" prefix or newline-separated
    let cleanedResponse = response;

    // Remove streaming prefixes like "0:", "1:", etc. that Next.js might add
    cleanedResponse = cleanedResponse.replace(/^\d+:/gm, '');

    // Try parsing as complete JSON first (most common case)
    try {
      const data = JSON.parse(cleanedResponse);
      if (data.enhanced_prompt) {
        return {
          enhanced: data.enhanced_prompt,
          original: data.analysis?.detected_intent || null
        };
      }
    } catch (e) {
      // Not a complete JSON, continue with other methods
    }

    // Try to find and parse JSON objects in the response
    // Use a more robust regex that handles nested objects
    const jsonRegex = /\{(?:[^{}]|(?:\{[^{}]*\}))*\}/g;
    const jsonMatches = cleanedResponse.match(jsonRegex);

    if (jsonMatches && jsonMatches.length > 0) {
      // Try parsing from the last match backwards (most complete data usually at the end)
      for (let i = jsonMatches.length - 1; i >= 0; i--) {
        try {
          const data = JSON.parse(jsonMatches[i]);

          // If we got valid data with enhanced_prompt, use it
          if (data.enhanced_prompt) {
            return {
              enhanced: data.enhanced_prompt,
              original: data.analysis?.detected_intent || null
            };
          }
        } catch (e) {
          // Try next match
          continue;
        }
      }
    }

    // If JSON parsing failed, try to extract text between quotes
    // Look for patterns like "enhanced_prompt":"text here" (handling escaped quotes and newlines)
    const enhancedMatch = cleanedResponse.match(/"enhanced_prompt"\s*:\s*"((?:[^"\\]|\\.)*)"/s);
    if (enhancedMatch) {
      const extracted = enhancedMatch[1]
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\');

      if (extracted && extracted.length > 0) {
        return {
          enhanced: extracted,
          original: null
        };
      }
    }

    // Last resort: return the cleaned response as-is if it has content
    const finalResponse = cleanedResponse.trim() || response.trim();
    if (finalResponse && finalResponse.length > 0) {
      return {
        enhanced: finalResponse,
        original: null
      };
    }

    // Nothing worked
    return {
      enhanced: null,
      original: null
    };
  } catch (error) {
    console.error('Parse error:', error);
    // Return raw response as fallback if it exists
    const fallback = response?.trim();
    return {
      enhanced: fallback || null,
      original: null
    };
  }
}

// Show error message
function showError(message) {
  errorMessage.textContent = message;
  errorState.classList.remove('hidden');
  loadingState.classList.add('hidden');
  resultSection.classList.add('hidden');
  setTimeout(() => {
    errorState.classList.add('hidden');
  }, 5000);
}

// Copy enhanced prompt to clipboard
copyPromptBtn.addEventListener('click', async () => {
  const text = window.lastEnhancedPrompt || enhancedReview.textContent;
  try {
    await navigator.clipboard.writeText(text);
    const originalText = copyPromptBtn.textContent;
    copyPromptBtn.textContent = '✓ Copied!';
    setTimeout(() => {
      copyPromptBtn.textContent = originalText;
    }, 2000);
  } catch (error) {
    showError('Failed to copy to clipboard');
  }
});

// Copy both reviews to clipboard
copyReviewsBtn.addEventListener('click', async () => {
  const originalText = window.lastOriginalPrompt || originalReview.textContent;
  const enhancedText = window.lastEnhancedPrompt || enhancedReview.textContent;
  const combinedText = `📝 Original:\n${originalText}\n\n✨ Enhanced:\n${enhancedText}`;

  try {
    await navigator.clipboard.writeText(combinedText);
    const btnOriginalText = copyReviewsBtn.textContent;
    copyReviewsBtn.textContent = '✓ Copied!';
    setTimeout(() => {
      copyReviewsBtn.textContent = btnOriginalText;
    }, 2000);
  } catch (error) {
    showError('Failed to copy to clipboard');
  }
});

// Save to history
function saveToHistory(original, enhanced) {
  chrome.storage.local.get(['history'], (result) => {
    let history = result.history || [];
    history.unshift({
      original,
      enhanced,
      timestamp: Date.now(),
      model: modelSelect.value,
      level: levelSelect.value,
    });

    // Keep only last 50 items
    history = history.slice(0, 50);

    chrome.storage.local.set({ history });
  });
}

// Settings button
settingsBtn.addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

// History link
historyLink.addEventListener('click', (e) => {
  e.preventDefault();
  // TODO: Open history view
  alert('History feature coming soon!');
});

// Save current settings
modelSelect.addEventListener('change', () => {
  chrome.storage.sync.set({ defaultModel: modelSelect.value });
});

levelSelect.addEventListener('change', () => {
  chrome.storage.sync.set({ defaultLevel: levelSelect.value });
});
