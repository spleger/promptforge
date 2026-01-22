// API Configuration
const API_BASE = 'https://promptforge.one';
const API_URL = `${API_BASE}/api/enhance`;
const SETTINGS_URL = `${API_BASE}/api/settings`;
const TOKEN_URL = `${API_BASE}/api/auth/token`;

// Token cache
let cachedToken = null;
let tokenExpiry = 0;

/**
 * Get a valid auth token, fetching a new one if needed.
 * Returns null if user is not logged in.
 */
async function getAuthToken() {
  // Return cached token if still valid (with 5 min buffer)
  if (cachedToken && Date.now() < tokenExpiry - 5 * 60 * 1000) {
    return cachedToken;
  }

  try {
    // Fetch new token from web app (uses cookies)
    const response = await fetch(TOKEN_URL, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      console.log('[PromptForge] User not authenticated, token fetch failed');
      cachedToken = null;
      tokenExpiry = 0;
      return null;
    }

    const data = await response.json();
    cachedToken = data.token;
    tokenExpiry = Date.now() + (data.expiresIn * 1000);
    console.log('[PromptForge] Token fetched successfully');
    return cachedToken;
  } catch (error) {
    console.error('[PromptForge] Token fetch error:', error);
    return null;
  }
}

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

  try {
    // Get auth token for cross-browser support (Firefox/Opera block third-party cookies)
    const token = await getAuthToken();

    const headers = {
      'Content-Type': 'application/json',
    };

    // Add Authorization header if we have a token
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('[PromptForge] Using token auth');
    } else {
      console.log('[PromptForge] No token, falling back to cookies');
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      credentials: 'include', // Still include cookies as fallback
      headers,
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

      // Return specific error types
      if (response.status === 401 || response.status === 403) {
        throw new Error('AUTH_ERROR: Please sign in at promptforge.one');
      } else if (response.status >= 500) {
        throw new Error('SERVER_ERROR: Server error occurred');
      } else {
        throw new Error(`API_ERROR: ${response.statusText}`);
      }
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

    // Parse enhanced prompt and improvement plan
    const result = parseEnhancedPrompt(fullResponse);

    console.log('[PromptForge] Parsed result:', result?.enhanced ? result.enhanced.substring(0, 100) + '...' : 'NULL');

    if (!result?.enhanced) {
      console.error('[PromptForge] Parse failed. Full response:', fullResponse);
      throw new Error('PARSE_ERROR: Could not parse enhanced prompt from response');
    }

    // Save to history
    saveToHistory(text, result.enhanced, model, level);

    return result;
  } catch (error) {
    // Network/fetch errors
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('NETWORK_ERROR: Check your internet connection');
    }
    // Re-throw our structured errors
    throw error;
  }
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
    enabledSites: ['chatgpt.com', 'claude.ai', 'gemini.google.com', 'notebooklm.google.com', 'perplexity.ai'],
  };
}

// Parse enhanced prompt from response
function parseEnhancedPrompt(response) {
  try {
    console.log('[PromptForge] Starting parse of response length:', response.length);

    // Step 1: Remove Vercel AI SDK streaming format prefixes (0:, e:, d:)
    // and extract just the content
    let content = '';
    let foundPromptId = null;
    const lines = response.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Check for data lines (d:) which contain promptId
      if (trimmed.startsWith('d:')) {
        try {
          const dataStr = trimmed.substring(2);
          // Vercel AI SDK often sends data as d:{"promptId":"..."} or d:[{"promptId":"..."}]
          // Parse it safely
          const data = JSON.parse(dataStr);
          // Check for promptId in various formats (object or array)
          if (data.promptId) {
            foundPromptId = data.promptId;
          } else if (Array.isArray(data)) {
            const item = data.find(i => i && i.promptId);
            if (item) foundPromptId = item.promptId;
          }
        } catch (e) {
          console.log('[PromptForge] Failed to parse data line:', e);
        }
        continue;
      }

      // Skip event lines
      if (trimmed.startsWith('e:')) {
        continue;
      }

      // Handle streaming chunks like 0:"content"
      const chunkMatch = trimmed.match(/^\d+:(.+)$/);
      if (chunkMatch) {
        let chunk = chunkMatch[1];
        // Try to parse as JSON string (handles escaped characters)
        try {
          if (chunk.startsWith('"') && chunk.endsWith('"')) {
            chunk = JSON.parse(chunk);
          }
        } catch (e) {
          // Not valid JSON string, use as-is but remove quotes
          if (chunk.startsWith('"') && chunk.endsWith('"')) {
            chunk = chunk.slice(1, -1);
          }
        }
        content += chunk;
      } else {
        content += trimmed;
      }
    }

    console.log('[PromptForge] Reconstructed content (first 500 chars):', content.substring(0, 500));

    // Step 2: Remove markdown code blocks if present
    // Handle ```json ... ``` or just ``` ... ```
    const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch && codeBlockMatch[1]) {
      content = codeBlockMatch[1].trim();
      console.log('[PromptForge] Extracted from code block');
    }

    // Step 3: Find the complete JSON object using balanced brace matching
    const firstBrace = content.indexOf('{');
    if (firstBrace === -1) {
      console.error('[PromptForge] No JSON object found');
      return null;
    }

    // Find the matching closing brace (balanced)
    let braceCount = 0;
    let endIndex = -1;
    for (let i = firstBrace; i < content.length; i++) {
      if (content[i] === '{') braceCount++;
      if (content[i] === '}') braceCount--;
      if (braceCount === 0) {
        endIndex = i;
        break;
      }
    }

    if (endIndex === -1) {
      console.error('[PromptForge] Unbalanced braces in JSON');
      return null;
    }

    const jsonString = content.substring(firstBrace, endIndex + 1);
    console.log('[PromptForge] Extracted balanced JSON, length:', jsonString.length);

    // Step 4: Parse JSON
    let data;
    try {
      data = JSON.parse(jsonString);
    } catch (e) {
      console.error('[PromptForge] JSON parse error:', e.message);
      return null;
    }

    // Step 4: Extract enhanced_prompt and improvement_plan
    if (data && data.enhanced_prompt) {
      console.log('[PromptForge] Successfully extracted enhanced_prompt');
      return {
        enhanced: data.enhanced_prompt,
        improvementPlan: data.improvement_plan || null,
        promptId: foundPromptId
      };
    }

    console.error('[PromptForge] No enhanced_prompt field in parsed data');
    return null;

  } catch (error) {
    console.error('[PromptForge] Parse error:', error);
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
      .then(result => {
        sendResponse({
          success: true,
          enhanced: result.enhanced,
          improvementPlan: result.improvementPlan,
          promptId: result.promptId
        });
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message });
      });
    return true; // Keep channel open for async response
  }

  if (request.action === 'openHistory') {
    // Open history page
    chrome.tabs.create({ url: request.url || 'https://promptforge.one/history' });
    return true;
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
