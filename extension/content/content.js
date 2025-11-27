// Listen for messages from popup and background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSelectedText') {
    const selectedText = window.getSelection().toString().trim();
    sendResponse({ text: selectedText });
  }

  else if (request.action === 'insertText') {
    insertTextIntoActiveElement(request.text);
    sendResponse({ success: true });
  }

  else if (request.action === 'showEnhancedPrompt') {
    showFloatingResult(request.original, request.enhanced);
    sendResponse({ success: true });
  }

  return true;
});

// Insert text into the active input/textarea
function insertTextIntoActiveElement(text) {
  const activeElement = document.activeElement;

  if (activeElement && (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT')) {
    // For regular input/textarea
    const start = activeElement.selectionStart;
    const end = activeElement.selectionEnd;
    const value = activeElement.value;

    activeElement.value = value.substring(0, start) + text + value.substring(end);
    activeElement.selectionStart = activeElement.selectionEnd = start + text.length;
    activeElement.focus();

    // Trigger input event for frameworks
    activeElement.dispatchEvent(new Event('input', { bubbles: true }));

  } else if (activeElement && activeElement.isContentEditable) {
    // For contenteditable elements
    document.execCommand('insertText', false, text);

  } else {
    // Try to find the most recent textarea/input
    const textareas = document.querySelectorAll('textarea, input[type="text"]');
    if (textareas.length > 0) {
      const lastTextarea = textareas[textareas.length - 1];
      lastTextarea.value = text;
      lastTextarea.focus();
      lastTextarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
}

// Show floating result notification
function showFloatingResult(original, enhanced) {
  // Remove existing notification if any
  const existing = document.getElementById('promptforge-notification');
  if (existing) {
    existing.remove();
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.id = 'promptforge-notification';
  notification.innerHTML = `
    <div class="promptforge-notification-header">
      <span class="promptforge-logo">✨ PromptForge</span>
      <button class="promptforge-close-btn" onclick="this.closest('#promptforge-notification').remove()">×</button>
    </div>
    <div class="promptforge-notification-content">
      <div class="promptforge-label">Enhanced Prompt (copied to clipboard)</div>
      <div class="promptforge-result">${escapeHtml(enhanced)}</div>
    </div>
    <div class="promptforge-notification-actions">
      <button class="promptforge-btn promptforge-btn-primary" onclick="navigator.clipboard.writeText('${escapeHtml(enhanced).replace(/'/g, "\\'")}'); this.textContent = 'Copied!'">
        Copy Again
      </button>
      <button class="promptforge-btn promptforge-btn-secondary" onclick="this.closest('#promptforge-notification').remove()">
        Close
      </button>
    </div>
  `;

  document.body.appendChild(notification);

  // Auto-remove after 10 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 10000);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Add floating button when text is selected in input fields
let floatingButton = null;

document.addEventListener('mouseup', (e) => {
  // Only show on input/textarea elements
  const target = e.target;
  if (target.tagName !== 'TEXTAREA' && target.tagName !== 'INPUT' && !target.isContentEditable) {
    removeFloatingButton();
    return;
  }

  const selectedText = window.getSelection().toString().trim();

  if (selectedText && selectedText.length >= 3) {
    showFloatingButton(e.clientX, e.clientY, selectedText);
  } else {
    removeFloatingButton();
  }
});

// Show floating enhance button
function showFloatingButton(x, y, text) {
  removeFloatingButton();

  floatingButton = document.createElement('div');
  floatingButton.id = 'promptforge-floating-btn';
  floatingButton.innerHTML = '✨ Enhance';
  floatingButton.style.left = `${x}px`;
  floatingButton.style.top = `${y + 20}px`;

  floatingButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({
      action: 'enhance',
      text: text
    });
    removeFloatingButton();
  });

  document.body.appendChild(floatingButton);

  // Remove on next click outside
  setTimeout(() => {
    document.addEventListener('click', removeFloatingButton, { once: true });
  }, 100);
}

// Remove floating button
function removeFloatingButton() {
  if (floatingButton && floatingButton.parentNode) {
    floatingButton.remove();
    floatingButton = null;
  }
}

// Detect and enhance AI tool interfaces (ChatGPT, Claude.ai, etc.)
function detectAITools() {
  const hostname = window.location.hostname;

  if (hostname.includes('chat.openai.com')) {
    enhanceChatGPTInterface();
  } else if (hostname.includes('claude.ai')) {
    enhanceClaudeInterface();
  }
}

// Enhance ChatGPT interface
function enhanceChatGPTInterface() {
  // TODO: Add button to ChatGPT's textarea
  console.log('ChatGPT detected - PromptForge ready');
}

// Enhance Claude.ai interface
function enhanceClaudeInterface() {
  // TODO: Add button to Claude's textarea
  console.log('Claude.ai detected - PromptForge ready');
}

// Initialize
detectAITools();
