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
    // CHANGE THIS: Use 'http://localhost:3001/api/enhance' for local dev
    const response = await fetch('https://promptforge.vercel.app/api/enhance', {
      method: 'POST',
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
    chrome.tabs.sendMessage(tabId, {
      action: 'showEnhancedPrompt',
      original: text,
      enhanced: enhancedPrompt
    });

    // Show success badge
    chrome.action.setBadgeText({ text: '✓' });
    chrome.action.setBadgeBackgroundColor({ color: '#10b981' });
    setTimeout(() => {
      chrome.action.setBadgeText({ text: '' });
    }, 3000);

    // Save to history
    saveToHistory(text, enhancedPrompt, model, level);

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
  }
}

// Parse enhanced prompt from response
function parseEnhancedPrompt(response) {
  try {
    let cleanedResponse = response;

    // Handle Vercel AI SDK streaming format
    cleanedResponse = cleanedResponse.replace(/^\d+:/gm, '');
    cleanedResponse = cleanedResponse.replace(/^```json\s*/gm, '');
    cleanedResponse = cleanedResponse.replace(/^```\s*/gm, '');
    cleanedResponse = cleanedResponse.replace(/```$/gm, '');

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

    // Try to parse the reconstructed JSON
    try {
      const data = JSON.parse(reconstructed);
      if (data.enhanced_prompt) {
        return data.enhanced_prompt;
      }
    } catch (e) {
      // Continue with other methods
    }

    // Try to extract JSON from the reconstructed text
    const jsonRegex = /\{(?:[^{}]|(?:\{[^{}]*\}))*\}/g;
    const jsonMatches = reconstructed.match(jsonRegex);

    if (jsonMatches && jsonMatches.length > 0) {
      for (let i = jsonMatches.length - 1; i >= 0; i--) {
        try {
          const data = JSON.parse(jsonMatches[i]);
          if (data.enhanced_prompt) {
            return data.enhanced_prompt;
          }
        } catch (e) {
          continue;
        }
      }
    }

    // Try string extraction
    const enhancedMatch = reconstructed.match(/"enhanced_prompt"\s*:\s*"((?:[^"\\]|\\.)*)"/s);
    if (enhancedMatch) {
      const extracted = enhancedMatch[1]
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\');

      if (extracted && extracted.length > 0) {
        return extracted;
      }
    }

    return null;
  } catch (error) {
    console.error('Parse error:', error);
    return null;
  }
}

// Copy text to clipboard
async function copyToClipboard(text) {
  // Chrome extensions need to use a workaround for clipboard
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
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
    enhanceAndNotify(request.text, sender.tab.id);
    sendResponse({ success: true });
  }
  return true;
});
