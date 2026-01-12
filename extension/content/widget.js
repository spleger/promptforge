/**
 * PromptForge Floating Widget
 * Injects enhancement widget near textboxes on AI provider sites
 */

// API Configuration
const API_BASE = 'https://promptforge.one';

// Site configurations for different AI providers
const SITE_CONFIGS = {
    'chatgpt.com': {
        textareaSelector: '#prompt-textarea, [contenteditable="true"][data-id], div[contenteditable="true"]',
        messageSelector: '[data-message-author-role]',
        // Multiple selectors for model name - ChatGPT changes UI frequently
        modelSelector: '[data-testid="model-switcher"] span, button[aria-haspopup="menu"] span, [aria-label*="Model"] span, .text-token-text-secondary',
        defaultModel: 'GPT-5.2',
        defaultContext: 400000,
        modelMap: {
            'gpt-5.2': 400000,
            'gpt-5.1': 400000,
            'gpt-5': 400000,
            'gpt-4.1': 1000000,
            'gpt-4o': 128000,
            'gpt-4': 128000,
            'o4': 200000,
            'o3': 200000,
        }
    },
    'chat.openai.com': {
        textareaSelector: '#prompt-textarea, [contenteditable="true"]',
        messageSelector: '[data-message-author-role]',
        modelSelector: '[data-testid="model-switcher"] span',
        defaultModel: 'GPT-5.2',
        defaultContext: 400000,
        modelMap: {
            'gpt-5.2': 400000,
            'gpt-5': 400000,
            'gpt-4o': 128000,
            'gpt-4': 128000,
        }
    },
    'claude.ai': {
        textareaSelector: '[contenteditable="true"].ProseMirror, div[contenteditable="true"], [data-placeholder]',
        // Better Claude message selectors - look for conversation containers
        messageSelector: '[data-is-streaming], [class*="Message"], [class*="message"], .prose, .whitespace-pre-wrap',
        modelSelector: 'button[data-testid="model-selector"] span, [class*="ModelSelector"] span, [aria-label*="model"] span',
        defaultModel: 'Claude Sonnet 4.5',
        defaultContext: 200000,
        modelMap: {
            'sonnet 4.5': 200000,
            'sonnet 4': 200000,
            'sonnet 3.5': 200000,
            'opus 4.5': 200000,
            'opus 4': 200000,
            'opus': 200000,
            'haiku 4.5': 200000,
            'haiku': 200000,
        }
    },
    'gemini.google.com': {
        textareaSelector: 'rich-textarea [contenteditable="true"], [contenteditable="true"][aria-label*="message"], textarea',
        messageSelector: '.conversation-turn, [data-message-id], message-content',
        modelSelector: '[data-model-selector] span, button[aria-label*="model"] span, .model-name',
        defaultModel: 'Gemini 2.5',
        defaultContext: 1048576,
        modelMap: {
            'gemini 2.5 pro': 1048576,
            'gemini 2.5 flash': 1048576,
            'gemini 2.5': 1048576,
            'gemini 1.5 pro': 2000000,
            'gemini': 1000000,
        }
    },
    'notebooklm.google.com': {
        textareaSelector: '[contenteditable="true"], textarea',
        messageSelector: '.message-content, [data-message]',
        modelSelector: null,
        defaultModel: 'NotebookLM',
        defaultContext: 1000000,
        modelMap: {
            'notebooklm': 1000000,
        }
    },
    'perplexity.ai': {
        textareaSelector: 'textarea, [contenteditable], .overflow-auto > div[contenteditable]',
        messageSelector: null,
        modelSelector: null,
        defaultModel: 'Perplexity',
        defaultContext: null,
        modelMap: {}
    }
};

// Generic config for user-added sites (no context tracking)
const GENERIC_CONFIG = {
    textareaSelector: 'textarea, [contenteditable="true"], input[type="text"]',
    messageSelector: null, // No message tracking for custom sites
    modelSelector: null,
    defaultModel: 'Custom Site',
    defaultContext: null, // null means don't show context indicator
    modelMap: {},
    isCustomSite: true
};

// State
let currentWidget = null;
let currentTextarea = null;
let contextPanelOpen = false;
let userSettings = null;
let isEnhancing = false;

/**
 * Show a toast notification
 */
function showToast(message) {
    // Remove existing toast
    const existing = document.querySelector('.pf-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'pf-toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        z-index: 999999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: pf-toast-in 0.3s ease;
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'pf-toast-out 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * Get current site configuration
 */
function getSiteConfig() {
    const hostname = window.location.hostname.replace('www.', '');

    // Check built-in configs first
    if (SITE_CONFIGS[hostname]) {
        return SITE_CONFIGS[hostname];
    }

    // Check if user added this site as custom
    if (userSettings?.enabledSites?.includes(hostname)) {
        return { ...GENERIC_CONFIG, defaultModel: hostname, isCustomSite: true };
    }

    // Check if it's a custom site that matches a pattern
    if (userSettings?.customSites) {
        for (const site of userSettings.customSites) {
            if (hostname.includes(site) || site.includes(hostname)) {
                return { ...GENERIC_CONFIG, defaultModel: site };
            }
        }
    }

    return null;
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

    // Use config defaults
    let modelName = config.defaultModel;
    let contextLimit = config.defaultContext || 200000;

    // Try to detect model from page
    if (config.modelSelector) {
        try {
            const modelEls = document.querySelectorAll(config.modelSelector);
            for (const modelEl of modelEls) {
                const modelText = (modelEl.textContent || '').toLowerCase().trim();
                if (!modelText || modelText.length > 50) continue; // Skip empty or too long

                // Check against known models
                for (const [key, limit] of Object.entries(config.modelMap)) {
                    if (modelText.includes(key.toLowerCase())) {
                        modelName = key.charAt(0).toUpperCase() + key.slice(1);
                        contextLimit = limit;
                        break;
                    }
                }
                if (modelName !== config.defaultModel) break;
            }
        } catch (e) {
            console.warn('[PromptForge] Model detection error:', e);
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

    // Check if this is a custom site (no context tracking)
    const config = getSiteConfig();
    const isCustomSite = config?.isCustomSite || config?.defaultContext === null;

    if (isCustomSite) {
        // Minimal widget for custom sites - just the enhance button
        widget.innerHTML = `
      <button class="pf-enhance-btn" title="Enhance with PromptForge">
        <span class="pf-btn-icon">🔥</span>
        <span class="pf-btn-text">Enhance</span>
      </button>
    `;
    } else {
        // Full widget with context tracking for known AI sites
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
    }

    // Enhance button click handler
    widget.querySelector('.pf-enhance-btn').addEventListener('click', handleEnhanceClick);

    // Context indicator click handler (only for known sites)
    const contextIndicator = widget.querySelector('.pf-context-indicator');
    if (contextIndicator) {
        contextIndicator.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
        contextIndicator.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleContextPanel();
        });
    }

    // Prevent panel clicks from closing
    const panel = widget.querySelector('.pf-context-panel');
    if (panel) {
        panel.addEventListener('mousedown', (e) => {
            e.stopPropagation();
        });
    }

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

    // Skip for custom sites (they don't have context elements)
    const dot = currentWidget.querySelector('.pf-context-dot');
    if (!dot) return;

    const usage = getContextUsage();
    const percentage = Math.min((usage.total / usage.limit) * 100, 100);
    const color = getUsageColor(percentage);

    // Update indicator
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

        // Try to replace textarea content
        const insertSuccess = setTextareaContent(currentTextarea, enhanced);

        if (!insertSuccess) {
            // DOM insertion failed (React site like Perplexity) - copy to clipboard
            console.log('[PromptForge] DOM insertion failed, copying to clipboard');
            await navigator.clipboard.writeText(enhanced);
            showToast('✨ Enhanced! Paste with Ctrl+V');
        } else {
            console.log('[PromptForge] Enhancement complete');
        }

        // Update context display
        setTimeout(updateContextDisplay, 500);

    } catch (error) {
        console.error('[PromptForge] Enhancement error:', error);
        showToast('❌ Enhancement failed');
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
 * Set content in textarea (handles contenteditable and React-based inputs)
 * Returns true if content was successfully set, false if React overwrote it
 */
function setTextareaContent(el, content) {
    console.log('[PromptForge] setTextareaContent called:', {
        tagName: el.tagName,
        contenteditable: el.getAttribute('contenteditable'),
        contentLength: content?.length
    });

    if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
        // For native textarea/input, use native value setter to bypass React
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            el.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype,
            'value'
        )?.set;

        if (nativeInputValueSetter) {
            nativeInputValueSetter.call(el, content);
        } else {
            el.value = content;
        }

        // Dispatch InputEvent which React listens to
        el.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: true, inputType: 'insertText', data: content }));
        console.log('[PromptForge] Set via native setter + InputEvent');

        // Check if it stuck
        const success = el.value === content;
        console.log('[PromptForge] Input success:', success);
        return success;
    } else {
        // For contenteditable (React-based like Perplexity)
        el.focus();

        // Try multiple strategies
        let success = false;

        // Strategy 1: execCommand (works on Claude, ChatGPT)
        try {
            document.execCommand('selectAll', false, null);
            success = document.execCommand('insertText', false, content);
            console.log('[PromptForge] execCommand result:', success);
        } catch (e) {
            console.log('[PromptForge] execCommand failed:', e);
        }

        // Strategy 2: Direct DOM manipulation with events (for React-based sites)
        if (!success || el.textContent !== content) {
            console.log('[PromptForge] Trying direct DOM manipulation');

            // Clear and set content directly
            el.textContent = '';
            el.textContent = content;

            // Dispatch events that React might listen to
            el.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: true, inputType: 'insertText', data: content }));
            el.dispatchEvent(new Event('change', { bubbles: true }));

            // Also try triggering a blur/focus cycle to force React update
            el.blur();
            el.focus();
        }

        // Strategy 3: If still not working, try innerText
        if (el.textContent !== content) {
            console.log('[PromptForge] Trying innerText fallback');
            el.innerText = content;
            el.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: true }));
        }

        const finalLength = el.textContent?.length || 0;
        const expectedLength = content?.length || 0;
        // Consider it a success if we got at least 80% of the content in
        const insertionSuccess = finalLength >= expectedLength * 0.8;

        console.log('[PromptForge] Final content length:', finalLength, 'Expected:', expectedLength, 'Success:', insertionSuccess);
        return insertionSuccess;
    }
}

/**
 * Position widget near textarea
 */
function positionWidget(textarea) {
    if (!currentWidget) return;

    const rect = textarea.getBoundingClientRect();
    const widgetHeight = 40;
    const panelHeight = 240; // Approximate panel height
    const viewportHeight = window.innerHeight;

    // Check if there's enough space above the textarea
    const spaceAbove = rect.top;

    // Decide if widget should be above or below textarea
    let widgetTop;

    if (spaceAbove > widgetHeight + 16) {
        // Position above textarea
        widgetTop = window.scrollY + rect.top - widgetHeight - 8;
    } else {
        // Position below textarea
        widgetTop = window.scrollY + rect.bottom + 8;
    }

    currentWidget.style.top = `${widgetTop}px`;
    currentWidget.style.left = `${window.scrollX + rect.right - currentWidget.offsetWidth}px`;

    // Calculate widget's viewport position for panel direction
    const widgetRect = currentWidget.getBoundingClientRect();
    const spaceBelowWidget = viewportHeight - widgetRect.bottom;

    // Panel should open upward if there's not enough space below for the panel
    const openUpward = spaceBelowWidget < panelHeight;

    // Set panel direction class
    const panel = currentWidget.querySelector('.pf-context-panel');
    if (panel) {
        if (openUpward) {
            panel.classList.add('open-upward');
            panel.classList.remove('open-downward');
        } else {
            panel.classList.remove('open-upward');
            panel.classList.add('open-downward');
        }
    }
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
async function init() {
    console.log('[PromptForge] Starting initialization...');

    // Load user settings first (needed to check custom sites)
    await loadUserSettings();

    const hostname = window.location.hostname.replace('www.', '');
    const config = getSiteConfig();

    // Check if this site is enabled
    const isBuiltIn = !!SITE_CONFIGS[hostname];
    const isEnabledCustom = userSettings?.enabledSites?.includes(hostname);

    if (!config && !isEnabledCustom) {
        console.log('[PromptForge] Site not supported or enabled:', hostname);
        return;
    }

    console.log('[PromptForge] Initializing widget for', hostname, isBuiltIn ? '(built-in)' : '(custom)');

    // Inject widget CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = chrome.runtime.getURL('content/widget.css');
    document.head.appendChild(link);

    // Get the actual config to use
    const activeConfig = config || { ...GENERIC_CONFIG, isCustomSite: true };

    // Listen for focus on textareas
    document.addEventListener('focusin', (e) => {
        const target = e.target;
        try {
            if (target.matches && target.matches(activeConfig.textareaSelector)) {
                showWidget(target);
            }
        } catch (err) {
            // Selector might not be valid for this site
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

    // Update context periodically (only for known sites)
    if (!activeConfig.isCustomSite) {
        setInterval(updateContextDisplay, 5000);
    }

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
