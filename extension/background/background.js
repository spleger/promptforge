// API Configuration
const API_BASE = 'https://promptforge.one';
const API_URL = `${API_BASE}/api/enhance`;
const SETTINGS_URL = `${API_BASE}/api/settings`;

// Context menu creation
chrome.runtime.onInstalled.addListener(() => {
  // Create context menu for text selection
  chrome.contextMenus.create({
    id: 'enhance-prompt',
    title: 'Enhance with PromptForge',
    contexts: ['selection']
  });

  console.log('PromptForge extension installed!');
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'enhance-prompt') {
    const selectedText = info.selectionText;
    if (selectedText) {
      enhanceAndNotify(selectedText, tab.id);
    }
  }
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
  if (command === 'enhance-selected') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'getSelectedText' }, (response) => {
        if (response && response.text) {
          enhanceAndNotify(response.text, tabs[0].id);
        }
      });
    });
  } else if (command === 'open-popup') {
    chrome.action.openPopup();
  }
});

// Enhance prompt and show notification
async function enhanceAndNotify(text, tabId) {
  try {
    // Get user settings
    const settings = await chrome.storage.sync.get(['defaultModel', 'defaultLevel']);
    const model = settings.defaultModel || 'claude-sonnet-4-5-20250929';
    const level = settings.defaultLevel || 'standard';

    // Show loading notification
    chrome.action.setBadgeText({ text: '...' });
    chrome.action.setBadgeBackgroundColor({ color: '#3b82f6' });

    // Make API request
    const response = await fetch(API_URL, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: text,
        targetModel: model,
        enhancementLevel: level,
      }),
    });

    if (!response.ok) {
      throw new Error('Enhancement failed');
    }

    // Read streaming response
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      fullResponse += decoder.decode(value);
    }

    // Parse enhanced prompt
    const enhancedPrompt = parseEnhancedPrompt(fullResponse);

    if (!enhancedPrompt) {
      throw new Error('Could not parse enhanced prompt');
    }

    // Copy to clipboard
    await copyToClipboard(enhancedPrompt);

    // Send to content script for insertion
    if (tabId) {
      chrome.tabs.sendMessage(tabId, {
        action: 'showEnhancedPrompt',
        original: text,
        enhanced: enhancedPrompt
      });
    }

    // Show success badge
    chrome.action.setBadgeText({ text: '✓' });
    chrome.action.setBadgeBackgroundColor({ color: '#10b981' });
    setTimeout(() => {
      chrome.action.setBadgeText({ text: '' });
    }, 3000);

    // Save to history
    saveToHistory(text, enhancedPrompt, model, level);

    return enhancedPrompt;

  } catch (error) {
    console.error('Enhancement error:', error);

    // Show error badge
    chrome.action.setBadgeText({ text: '✗' });
    chrome.action.setBadgeBackgroundColor({ color: '#ef4444' });
    setTimeout(() => {
      chrome.action.setBadgeText({ text: '' });
    }, 3000);

    // Show error notification
    chrome.notifications.create({
      type: 'basic',
      iconUrl: '../icons/icon128.png',
      title: 'PromptForge Error',
      message: error.message || 'Failed to enhance prompt'
    });

    throw error;
  }
}

// Enhance prompt and return result (for widget)
async function enhancePrompt(text, settings) {
  const model = settings?.defaultModel || 'claude-sonnet-4-5-20250929';
  const level = settings?.defaultLevel || 'standard';

  console.log('[PromptForge] Starting enhancement:', { text: text.substring(0, 50), model, level });
  console.log('[PromptForge] API URL:', API_URL);

  const response = await fetch(API_URL, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: text,
      targetModel: model,
      enhancementLevel: level,
    }),
  });

  console.log('[PromptForge] Response status:', response.status, response.statusText);

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'Could not read body');
    console.error('[PromptForge] Response not OK:', errorBody);
    throw new Error('Enhancement failed');
  }

  // Read streaming response
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullResponse = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    fullResponse += decoder.decode(value);
  }

  console.log('[PromptForge] Raw response (first 500 chars):', fullResponse.substring(0, 500));

  // Parse enhanced prompt
  const enhancedPrompt = parseEnhancedPrompt(fullResponse);

  console.log('[PromptForge] Parsed result:', enhancedPrompt ? enhancedPrompt.substring(0, 100) + '...' : 'NULL');

  if (!enhancedPrompt) {
    console.error('[PromptForge] Parse failed. Full response:', fullResponse);
    throw new Error('Could not parse enhanced prompt');
  }

  // Save to history
  saveToHistory(text, enhancedPrompt, model, level);

  return enhancedPrompt;
}

// Fetch user settings from API
async function fetchUserSettings() {
  try {
    const response = await fetch(SETTINGS_URL, {
      method: 'GET',
      credentials: 'include',
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn('Could not fetch settings from API:', error);
  }

  // Fall back to local storage
  const stored = await chrome.storage.sync.get(['defaultModel', 'defaultLevel']);
  return {
    defaultModel: stored.defaultModel || 'claude-sonnet-4-5-20250929',
    defaultLevel: stored.defaultLevel || 'standard',
    enabledSites: ['chatgpt.com', 'claude.ai', 'gemini.google.com', 'notebooklm.google.com'],
  };
}

// Parse enhanced prompt from response
function parseEnhancedPrompt(response) {
  try {
    let cleanedResponse = response;

    // Handle Vercel AI SDK streaming format
    cleanedResponse = cleanedResponse.replace(/^\d+:/gm, '');

    // Handle quoted chunks
    const lines = cleanedResponse.split('\n').filter(line => line.trim());
    let reconstructed = '';

    for (const line of lines) {
      // Skip metadata lines
      if (line.startsWith('e:') || line.startsWith('d:')) {
        continue;
      }

      // Try to parse as JSON string
      try {
        if (line.startsWith('"') && line.endsWith('"')) {
          const parsed = JSON.parse(line);
          reconstructed += parsed;
        } else {
          reconstructed += line;
        }
      } catch (e) {
        reconstructed += line;
      }
    }

    // Check for markdown code blocks
    const markdownMatch = reconstructed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (markdownMatch && markdownMatch[1]) {
      reconstructed = markdownMatch[1];
    }

    // Try to parse the reconstructed JSON
    try {
      const data = JSON.parse(reconstructed);
      if (data.enhanced_prompt) {
        return data.enhanced_prompt;
      }
    } catch (e) {
      // Continue with other methods
    }

    // Try to extract JSON object { ... }
    try {
      const firstOpen = reconstructed.indexOf('{');
      const lastClose = reconstructed.lastIndexOf('}');

      if (firstOpen !== -1 && lastClose !== -1 && lastClose > firstOpen) {
        const jsonString = reconstructed.substring(firstOpen, lastClose + 1);
        const data = JSON.parse(jsonString);
        if (data.enhanced_prompt) {
          return data.enhanced_prompt;
        }
      }
    } catch (e) {
      // Continue
    }

    return null;
  } catch (error) {
    console.error('Parse error:', error);
    return null;
  }
}

// Copy text to clipboard
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (e) {
    // Fallback for service worker context
    console.warn('Clipboard API not available in service worker');
  }
}

// Save to history
function saveToHistory(original, enhanced, model, level) {
  chrome.storage.local.get(['history'], (result) => {
    let history = result.history || [];
    history.unshift({
      original,
      enhanced,
      timestamp: Date.now(),
      model,
      level,
    });
    history = history.slice(0, 50);
    chrome.storage.local.set({ history });
  });
}

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'enhance') {
    // Widget enhancement request
    enhancePrompt(request.text, request.settings)
      .then(enhanced => {
        sendResponse({ success: true, enhanced });
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message });
      });
    return true; // Keep channel open for async response
  }

  if (request.action === 'getSettings') {
    // Widget settings request
    fetchUserSettings()
      .then(settings => {
        sendResponse(settings);
      })
      .catch(() => {
        sendResponse({
          defaultModel: 'claude-sonnet-4-5-20250929',
          defaultLevel: 'standard',
          enabledSites: ['chatgpt.com', 'claude.ai', 'gemini.google.com', 'notebooklm.google.com'],
        });
      });
    return true; // Keep channel open for async response
  }

  return true;
});
