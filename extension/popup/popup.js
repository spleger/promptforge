// API Configuration
const API_URL = 'https://promptforge.vercel.app/api/enhance';

// DOM Elements
const promptInput = document.getElementById('promptInput');
const modelSelect = document.getElementById('modelSelect');
const levelSelect = document.getElementById('levelSelect');
const enhanceBtn = document.getElementById('enhanceBtn');
const loadingState = document.getElementById('loadingState');
const resultSection = document.getElementById('resultSection');
const resultText = document.getElementById('resultText');
const errorState = document.getElementById('errorState');
const errorMessage = document.getElementById('errorMessage');
const copyBtn = document.getElementById('copyBtn');
const insertBtn = document.getElementById('insertBtn');
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
    const enhancedPrompt = parseEnhancedPrompt(fullResponse);

    if (!enhancedPrompt) {
      throw new Error('Could not parse enhanced prompt');
    }

    // Show result
    resultText.textContent = enhancedPrompt;
    resultSection.classList.remove('hidden');
    loadingState.classList.add('hidden');

    // Save to history
    saveToHistory(prompt, enhancedPrompt);

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
      return data.enhanced_prompt || null;
    }
    // If no JSON found, return the raw response
    return response.trim();
  } catch (error) {
    return response.trim();
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

// Copy to clipboard
copyBtn.addEventListener('click', async () => {
  const text = resultText.textContent;
  try {
    await navigator.clipboard.writeText(text);
    copyBtn.textContent = '✓ Copied!';
    setTimeout(() => {
      copyBtn.innerHTML = '📋 Copy';
    }, 2000);
  } catch (error) {
    showError('Failed to copy to clipboard');
  }
});

// Insert into page
insertBtn.addEventListener('click', async () => {
  const text = resultText.textContent;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: 'insertText',
      text: text
    }, (response) => {
      if (response && response.success) {
        insertBtn.textContent = '✓ Inserted!';
        setTimeout(() => {
          insertBtn.innerHTML = '✏️ Insert';
        }, 2000);
      } else {
        showError('Failed to insert text. Please copy and paste manually.');
      }
    });
  });
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
