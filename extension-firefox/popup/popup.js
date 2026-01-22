// API Configuration
const API_URL = 'https://promptforge.one/api/enhance';

// DOM Elements
const promptInput = document.getElementById('promptInput');
const modelSelect = document.getElementById('modelSelect');
const levelSelect = document.getElementById('levelSelect');
const enhanceBtn = document.getElementById('enhanceBtn');
const loadingState = document.getElementById('loadingState');
const resultSection = document.getElementById('resultSection');
// const originalReview = document.getElementById('originalReview');
const enhancedReview = document.getElementById('enhancedReview');
const errorState = document.getElementById('errorState');
const errorMessage = document.getElementById('errorMessage');
const copyPromptBtn = document.getElementById('copyPromptBtn');
const copyReviewsBtn = document.getElementById('copyReviewsBtn');
const settingsBtn = document.getElementById('settingsBtn');
const historyLink = document.getElementById('historyLink');
const widgetToggle = document.getElementById('widgetToggle');

// Load saved settings from background (API-first)
chrome.runtime.sendMessage({ action: 'getSettings' }, (settings) => {
  if (chrome.runtime.lastError) {
    console.warn('Could not load settings:', chrome.runtime.lastError);
    return;
  }
  if (settings?.defaultModel) {
    modelSelect.value = settings.defaultModel;
  }
  if (settings?.defaultLevel) {
    levelSelect.value = settings.defaultLevel;
  }
});

// Load widget enabled state from sync storage
chrome.storage.sync.get(['widgetEnabled'], (result) => {
  // Default to enabled if not set
  widgetToggle.checked = result.widgetEnabled !== false;
});

// Save widget enabled state when changed
widgetToggle.addEventListener('change', () => {
  chrome.storage.sync.set({ widgetEnabled: widgetToggle.checked }, () => {
    console.log('Widget enabled state saved:', widgetToggle.checked);

    // Notify all tabs to reload widget state
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          action: 'widgetToggleChanged',
          enabled: widgetToggle.checked
        }).catch(() => { }); // Ignore errors for tabs without content script
      });
    });
  });
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

    console.log('Starting enhancement...');
    console.log('API URL:', API_URL);
    console.log('Payload:', { input: prompt.substring(0, 50) + '...', targetModel: modelSelect.value, enhancementLevel: levelSelect.value });

    const response = await fetch(API_URL, {
      method: 'POST',
      credentials: 'include', // Send cookies for authentication
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: prompt,
        targetModel: modelSelect.value,
        enhancementLevel: levelSelect.value,
      }),
    });

    console.log('Response status:', response.status, response.statusText);
    console.log('Response headers:', [...response.headers.entries()]);

    if (!response.ok) {
      let errorMessage = `API Error (${response.status} ${response.statusText})`;
      let errorDetails = '';

      try {
        const errorData = await response.json();
        console.error('Error data:', errorData);
        errorMessage = errorData.error || errorData.message || errorMessage;
        errorDetails = JSON.stringify(errorData);
      } catch (e) {
        // If JSON parsing fails, try to get text
        try {
          const errorText = await response.text();
          console.error('Error text:', errorText);
          errorDetails = errorText;
          if (errorText && errorText.length < 200) {
            errorMessage = errorText;
          }
        } catch (e2) {
          console.error('Could not read error response');
        }
      }

      // Provide more specific error messages based on status code
      if (response.status === 0) {
        errorMessage = 'Network error - Cannot reach API server';
      } else if (response.status === 404) {
        errorMessage = 'API endpoint not found (404) - Check API_URL';
      } else if (response.status === 405) {
        errorMessage = 'Method Not Allowed (405) - API route may not support POST. Check app/api/enhance/route.ts';
      } else if (response.status === 500) {
        errorMessage = 'Server error (500) - API is having issues';
      } else if (response.status === 429) {
        errorMessage = 'Rate limited (429) - Too many requests, try again later';
      } else if (response.status === 401 || response.status === 403) {
        errorMessage = 'Authentication error - API key may be invalid';
      }

      console.error('Full error:', errorMessage, errorDetails);
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
    // originalReview.textContent = parsedResponse.original || prompt;
    enhancedReview.textContent = parsedResponse.enhanced;
    resultSection.classList.remove('hidden');
    loadingState.classList.add('hidden');

    // Store for copy actions
    window.lastEnhancedPrompt = parsedResponse.enhanced;
    window.lastOriginalPrompt = prompt;

    // Save to history
    saveToHistory(prompt, parsedResponse.enhanced);

  } catch (error) {
    console.error('Enhancement error:', error);

    // Provide more helpful error messages
    let userMessage = error.message;

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      userMessage = 'Cannot connect to API - Check your internet connection or API URL';
    } else if (error.name === 'TypeError') {
      userMessage = 'Network error - Cannot reach PromptForge API';
    }

    showError(userMessage || 'Failed to enhance prompt');
  } finally {
    enhanceBtn.disabled = false;
  }
}

// Parse enhanced prompt from streaming response
function parseEnhancedPrompt(response) {
  try {
    console.log('Parsing response (first 500 chars):', response.substring(0, 500));

    let cleanedResponse = response;

    // Handle Vercel AI SDK streaming format - remove data stream prefixes
    // Format is often: 0:"chunk1"\n1:"chunk2"\n or similar
    cleanedResponse = cleanedResponse.replace(/^\d+:/gm, '');

    // Handle quoted chunks - the AI SDK may send each chunk as a quoted string
    // Split by newlines and parse each line
    const lines = cleanedResponse.split('\n').filter(line => line.trim());
    let reconstructed = '';

    for (const line of lines) {
      // Skip metadata lines (e:..., d:...)
      if (line.startsWith('e:') || line.startsWith('d:')) {
        continue;
      }

      // Try to parse as JSON string
      try {
        // If line is a quoted string, parse it
        if (line.startsWith('"') && line.endsWith('"')) {
          const parsed = JSON.parse(line);
          reconstructed += parsed;
        } else {
          reconstructed += line;
        }
      } catch (e) {
        // Not a JSON string, just append
        reconstructed += line;
      }
    }

    // Check for markdown code blocks in the reconstructed text
    // This is the key fix for Haiku/other models wrapping output
    const markdownMatch = reconstructed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (markdownMatch && markdownMatch[1]) {
      console.log("Found markdown block, extracting content");
      reconstructed = markdownMatch[1];
    }

    console.log('Reconstructed (first 500 chars):', reconstructed.substring(0, 500));

    // Now try to parse the reconstructed JSON
    // First attempt: direct parse
    try {
      const data = JSON.parse(reconstructed);
      if (data.enhanced_prompt) {
        console.log('Successfully parsed enhanced_prompt');
        return {
          enhanced: data.enhanced_prompt,
          original: data.analysis?.detected_intent || null
        };
      }
    } catch (e) {
      console.warn('Could not parse as complete JSON:', e.message);
    }

    // Second attempt: Find JSON object { ... }
    try {
      const firstOpen = reconstructed.indexOf('{');
      const lastClose = reconstructed.lastIndexOf('}');

      if (firstOpen !== -1 && lastClose !== -1 && lastClose > firstOpen) {
        const jsonString = reconstructed.substring(firstOpen, lastClose + 1);
        const data = JSON.parse(jsonString);
        if (data.enhanced_prompt) {
          console.log('Found enhanced_prompt in extracted JSON');
          return {
            enhanced: data.enhanced_prompt,
            original: data.analysis?.detected_intent || null
          };
        }
      }
    } catch (e) {
      console.warn("JSON extraction failed", e);
    }

    console.error('Could not parse response at all');
    return {
      enhanced: null,
      original: null
    };
  } catch (error) {
    console.error('Parse error:', error);
    return {
      enhanced: null,
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
  const originalText = window.lastOriginalPrompt || promptInput.value;
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
if (settingsBtn) {
  settingsBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://promptforge.one/settings' });
  });
}

// History link
historyLink.addEventListener('click', (e) => {
  e.preventDefault();
  chrome.tabs.create({ url: 'https://promptforge.one/history' });
});

// Save current settings
modelSelect.addEventListener('change', () => {
  chrome.storage.sync.set({ defaultModel: modelSelect.value });
});

levelSelect.addEventListener('change', () => {
  chrome.storage.sync.set({ defaultLevel: levelSelect.value });
});
