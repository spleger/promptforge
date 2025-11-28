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
    // CHANGE THIS: Use 'http://localhost:3000/api/enhance' for local dev
    const response = await fetch('http://localhost:3000/api/enhance', {
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
    // Handle streaming format - data might be in chunks with "0:" prefix or newline-separated
    let cleanedResponse = response;

    // Remove streaming prefixes like "0:", "1:", etc. that Next.js might add
    cleanedResponse = cleanedResponse.replace(/^\d+:/gm, '');

    // Try parsing as complete JSON first (most common case)
    try {
      const data = JSON.parse(cleanedResponse);
      if (data.enhanced_prompt) {
        return data.enhanced_prompt;
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
            return data.enhanced_prompt;
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
        return extracted;
      }
    }

    // Last resort: return the cleaned response as-is if it has content
    const finalResponse = cleanedResponse.trim() || response.trim();
    if (finalResponse && finalResponse.length > 0) {
      return finalResponse;
    }

    // Nothing worked
    return null;
  } catch (error) {
    console.error('Parse error:', error);
    return response?.trim() || null;
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
