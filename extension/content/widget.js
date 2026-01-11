/**
 * PromptForge Floating Widget
 * Injects enhancement widget near textboxes on AI provider sites
 */

// API Configuration
const API_BASE = 'https://promptforge.one';

// Site configurations for different AI providers
const SITE_CONFIGS = {
    'chatgpt.com': {
        textareaSelector: '#prompt-textarea, [contenteditable="true"][data-id]',
        messageSelector: '[data-message-author-role]',
        modelSelector: '[data-testid="model-switcher"] span, [data-state="closed"][role="combobox"] span',
        defaultModel: 'GPT-4o',
        modelMap: {
            'gpt-4o': 128000,
            'gpt-4': 128000,
            'gpt-4.1': 1000000,
            'gpt-5': 400000,
            'o3': 200000,
            'o4': 200000,
        }
    },
    'chat.openai.com': {
        textareaSelector: '#prompt-textarea, [contenteditable="true"]',
        messageSelector: '[data-message-author-role]',
        modelSelector: '[data-testid="model-switcher"] span',
        defaultModel: 'GPT-4o',
        modelMap: {
            'gpt-4o': 128000,
            'gpt-4': 128000,
        }
    },
    'claude.ai': {
        textareaSelector: '[contenteditable="true"].ProseMirror, div[contenteditable="true"]',
        messageSelector: '[data-testid="user-message"], [data-testid="assistant-message"]',
        modelSelector: 'button[data-testid="model-selector"] span, [class*="ModelSelector"] span',
        defaultModel: 'Claude Sonnet',
        modelMap: {
            'sonnet 4.5': 1000000,
            'sonnet 4': 1000000,
            'sonnet 3.5': 200000,
            'opus 4.5': 200000,
            'opus': 200000,
            'haiku': 200000,
        }
    },
    'gemini.google.com': {
        textareaSelector: 'rich-textarea [contenteditable="true"], [contenteditable="true"][aria-label*="message"]',
        messageSelector: '.conversation-turn, [data-message-id]',
        modelSelector: '[data-model-selector] span, button[aria-label*="model"] span',
        defaultModel: 'Gemini',
        modelMap: {
            'gemini 2.5': 1048576,
            'gemini 2.5 pro': 1048576,
            'gemini 2.5 flash': 1048576,
            'gemini 1.5 pro': 2000000,
            'gemini': 1000000,
        }
    },
    'notebooklm.google.com': {
        textareaSelector: '[contenteditable="true"], textarea',
        messageSelector: '.message-content, [data-message]',
        modelSelector: null, // NotebookLM doesn't show model selector
        defaultModel: 'NotebookLM',
        modelMap: {
            'notebooklm': 1000000,
        }
    }
};

// State
let currentWidget = null;
let currentTextarea = null;
let contextPanelOpen = false;
let userSettings = null;
let isEnhancing = false;

/**
 * Get current site configuration
 */
function getSiteConfig() {
    const hostname = window.location.hostname.replace('www.', '');
    return SITE_CONFIGS[hostname] || null;
}

/**
 * Check if widget is enabled for current site
 */
function isWidgetEnabled() {
    if (!userSettings) return true; // Default to enabled
    const hostname = window.location.hostname.replace('www.', '');
    return userSettings.enabledSites?.includes(hostname) ?? true;
}

/**
 * Load user settings from API
 */
async function loadUserSettings() {
    try {
        const response = await new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({ action: 'getSettings' }, (response) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(response);
                }
            });
        });
        userSettings = response;
        console.log('[PromptForge] Settings loaded:', userSettings);
    } catch (error) {
        console.warn('[PromptForge] Could not load settings, using defaults');
        userSettings = {
            defaultModel: 'claude-sonnet-4-5-20250929',
            defaultLevel: 'standard',
            enabledSites: Object.keys(SITE_CONFIGS),
        };
    }
}

/**
 * Estimate token count from text
 * ~4 characters per token for English text
 */
function estimateTokens(text) {
    if (!text) return 0;
    return Math.ceil(text.length / 4);
}

/**
 * Get context window usage for current conversation
 */
function getContextUsage() {
    const config = getSiteConfig();
    if (!config) return { userTokens: 0, aiTokens: 0, total: 0, limit: 200000, model: 'Unknown' };

    const messages = document.querySelectorAll(config.messageSelector);
    let userTokens = 0;
    let aiTokens = 0;

    messages.forEach(msg => {
        const text = msg.textContent || '';
        const tokens = estimateTokens(text);

        // Detect if user or AI message
        const isUser = msg.matches('[data-message-author-role="user"]') ||
            msg.classList.contains('user-message') ||
            msg.getAttribute('data-testid')?.includes('user');

        if (isUser) {
            userTokens += tokens;
        } else {
            aiTokens += tokens;
        }
    });

    // Detect current model
    let modelName = config.defaultModel;
    let contextLimit = Object.values(config.modelMap)[0] || 200000;

    if (config.modelSelector) {
        const modelEl = document.querySelector(config.modelSelector);
        if (modelEl) {
            const modelText = modelEl.textContent?.toLowerCase() || '';
            for (const [key, limit] of Object.entries(config.modelMap)) {
                if (modelText.includes(key.toLowerCase())) {
                    modelName = key;
                    contextLimit = limit;
                    break;
                }
            }
        }
    }

    return {
        userTokens,
        aiTokens,
        total: userTokens + aiTokens,
        limit: contextLimit,
        model: modelName
    };
}

/**
 * Get color class based on usage percentage
 */
function getUsageColor(percentage) {
    if (percentage >= 100) return 'red';
    if (percentage >= 80) return 'yellow';
    return 'green';
}

/**
 * Format token count for display
 */
function formatTokens(count) {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(0) + 'K';
    return count.toString();
}

/**
 * Create the floating widget element
 */
function createWidget() {
    const widget = document.createElement('div');
    widget.className = 'pf-widget';
    widget.innerHTML = `
    <button class="pf-enhance-btn" title="Enhance with PromptForge">
      <span class="pf-btn-icon">🔥</span>
      <span class="pf-btn-text">Enhance</span>
    </button>
    <div class="pf-context-indicator" title="Click to see details">
      <span class="pf-context-dot green"></span>
      <span class="pf-context-text">0K/200K</span>
    </div>
    <div class="pf-context-panel">
      <div class="pf-context-title">Context Usage</div>
      <div class="pf-progress-bar">
        <div class="pf-progress-fill green" style="width: 0%"></div>
      </div>
      <div class="pf-stat-row">
        <span><span class="pf-icon">🧑</span>You</span>
        <span class="pf-value pf-user-tokens">0</span>
      </div>
      <div class="pf-stat-row">
        <span><span class="pf-icon">🤖</span>AI</span>
        <span class="pf-value pf-ai-tokens">0</span>
      </div>
      <div class="pf-divider"></div>
      <div class="pf-stat-row">
        <span>Total</span>
        <span class="pf-value pf-total-tokens">0 / 200K</span>
      </div>
      <div class="pf-model-info">
        <span>📊</span>
        <span class="pf-model-name">Detecting...</span>
      </div>
    </div>
  `;

    // Enhance button click handler
    widget.querySelector('.pf-enhance-btn').addEventListener('click', handleEnhanceClick);

    // Context indicator click handler - use mousedown to fire before focusout
    const contextIndicator = widget.querySelector('.pf-context-indicator');
    contextIndicator.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
    });
    contextIndicator.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleContextPanel();
    });

    // Prevent panel clicks from closing
    widget.querySelector('.pf-context-panel').addEventListener('mousedown', (e) => {
        e.stopPropagation();
    });

    return widget;
}

/**
 * Toggle context panel visibility
 */
function toggleContextPanel() {
    const panel = currentWidget?.querySelector('.pf-context-panel');
    if (!panel) return;

    contextPanelOpen = !contextPanelOpen;
    panel.classList.toggle('visible', contextPanelOpen);

    if (contextPanelOpen) {
        updateContextDisplay();
    }
}

/**
 * Close context panel
 */
function closeContextPanel() {
    const panel = currentWidget?.querySelector('.pf-context-panel');
    if (panel) {
        panel.classList.remove('visible');
        contextPanelOpen = false;
    }
}

/**
 * Update context display with current usage
 */
function updateContextDisplay() {
    if (!currentWidget) return;

    const usage = getContextUsage();
    const percentage = Math.min((usage.total / usage.limit) * 100, 100);
    const color = getUsageColor(percentage);

    // Update indicator
    const dot = currentWidget.querySelector('.pf-context-dot');
    const text = currentWidget.querySelector('.pf-context-text');
    dot.className = `pf-context-dot ${color}`;
    text.textContent = `${formatTokens(usage.total)}/${formatTokens(usage.limit)}`;

    // Update panel
    const fill = currentWidget.querySelector('.pf-progress-fill');
    fill.style.width = `${percentage}%`;
    fill.className = `pf-progress-fill ${color}`;

    currentWidget.querySelector('.pf-user-tokens').textContent = formatTokens(usage.userTokens);
    currentWidget.querySelector('.pf-ai-tokens').textContent = formatTokens(usage.aiTokens);
    currentWidget.querySelector('.pf-total-tokens').textContent =
        `${formatTokens(usage.total)} / ${formatTokens(usage.limit)}`;
    currentWidget.querySelector('.pf-model-name').textContent = usage.model;
}

/**
 * Handle enhance button click
 */
async function handleEnhanceClick(e) {
    e.preventDefault();
    e.stopPropagation();

    if (isEnhancing || !currentTextarea) return;

    const text = getTextareaContent(currentTextarea);
    if (!text || text.trim().length < 3) {
        console.log('[PromptForge] Text too short to enhance');
        return;
    }

    isEnhancing = true;
    const btn = currentWidget.querySelector('.pf-enhance-btn');
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<div class="pf-spinner"></div><span>Enhancing...</span>';
    btn.classList.add('loading');

    try {
        const enhanced = await new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({
                action: 'enhance',
                text: text,
                settings: userSettings
            }, (response) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else if (response?.success) {
                    resolve(response.enhanced);
                } else {
                    reject(new Error(response?.error || 'Enhancement failed'));
                }
            });
        });

        // Replace textarea content
        setTextareaContent(currentTextarea, enhanced);
        console.log('[PromptForge] Enhancement complete');

        // Update context display
        setTimeout(updateContextDisplay, 500);

    } catch (error) {
        console.error('[PromptForge] Enhancement error:', error);
        // Could show error toast here
    } finally {
        isEnhancing = false;
        btn.innerHTML = originalContent;
        btn.classList.remove('loading');
    }
}

/**
 * Get content from textarea (handles contenteditable)
 */
function getTextareaContent(el) {
    if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
        return el.value;
    }
    return el.innerText || el.textContent || '';
}

/**
 * Set content in textarea (handles contenteditable)
 */
function setTextareaContent(el, content) {
    if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
        el.value = content;
        el.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
        // For contenteditable
        el.focus();
        document.execCommand('selectAll', false, null);
        document.execCommand('insertText', false, content);
        el.dispatchEvent(new Event('input', { bubbles: true }));
    }
}

/**
 * Position widget near textarea
 */
function positionWidget(textarea) {
    if (!currentWidget) return;

    const rect = textarea.getBoundingClientRect();
    const widgetHeight = 36;

    // Position above the textarea, aligned to right
    currentWidget.style.top = `${window.scrollY + rect.top - widgetHeight - 8}px`;
    currentWidget.style.left = `${window.scrollX + rect.right - currentWidget.offsetWidth}px`;
}

/**
 * Show widget for textarea
 */
function showWidget(textarea) {
    if (!isWidgetEnabled()) return;
    if (currentTextarea === textarea && currentWidget) {
        currentWidget.classList.add('visible');
        return;
    }

    hideWidget();

    currentTextarea = textarea;
    currentWidget = createWidget();
    document.body.appendChild(currentWidget);

    // Position after adding to DOM so we can measure
    requestAnimationFrame(() => {
        positionWidget(textarea);
        currentWidget.classList.add('visible');
        updateContextDisplay();
    });
}

/**
 * Hide widget
 */
function hideWidget() {
    if (currentWidget) {
        currentWidget.classList.remove('visible');
        setTimeout(() => {
            currentWidget?.remove();
            currentWidget = null;
            currentTextarea = null;
            contextPanelOpen = false;
        }, 200);
    }
}

/**
 * Initialize widget for current site
 */
function init() {
    const config = getSiteConfig();
    if (!config) {
        console.log('[PromptForge] Site not supported');
        return;
    }

    console.log('[PromptForge] Initializing widget for', window.location.hostname);

    // Load user settings
    loadUserSettings();

    // Inject widget CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = chrome.runtime.getURL('content/widget.css');
    document.head.appendChild(link);

    // Listen for focus on textareas
    document.addEventListener('focusin', (e) => {
        const target = e.target;
        if (target.matches(config.textareaSelector)) {
            showWidget(target);
        }
    });

    // Hide on blur (with delay to allow button clicks)
    document.addEventListener('focusout', (e) => {
        setTimeout(() => {
            const active = document.activeElement;
            if (!currentWidget?.contains(active) && active !== currentTextarea) {
                hideWidget();
            }
        }, 150);
    });

    // Update context periodically
    setInterval(updateContextDisplay, 5000);

    // Reposition on scroll/resize
    window.addEventListener('scroll', () => {
        if (currentTextarea) positionWidget(currentTextarea);
    }, { passive: true });

    window.addEventListener('resize', () => {
        if (currentTextarea) positionWidget(currentTextarea);
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
