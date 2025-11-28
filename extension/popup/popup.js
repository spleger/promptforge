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
  chrome.tabs.sendMessage(tabs[0].id, { action: 'getSelectedText' }, (response) => {
    if (response && response.text) {
      promptInput.value = response.text;
      promptInput.focus();
    }
  });
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
      const errorData = await response.json();
      throw new Error(errorData.error || 'Enhancement failed');
    }

    // Read the streaming response
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      fullResponse += chunk;
    }

    // Parse the enhanced prompt from the response
    const parsedResponse = parseEnhancedPrompt(fullResponse);

    if (!parsedResponse.enhanced) {
      throw new Error('Could not parse enhanced prompt');
    }

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
    // Try to extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);
      return {
        enhanced: data.enhanced_prompt || response.trim(),
        original: data.analysis?.detected_intent || null
      };
    }
    // If no JSON found, return the raw response
    return {
      enhanced: response.trim(),
      original: null
    };
  } catch (error) {
    return {
      enhanced: response.trim(),
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
