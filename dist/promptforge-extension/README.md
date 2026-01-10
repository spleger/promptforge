# PromptForge Browser Extension

Transform casual descriptions into optimized AI prompts instantly - right in your browser!

## Features

- **Quick Popup**: Click the extension icon for instant access to the prompt enhancer
- **Context Menu**: Right-click selected text and choose "Enhance with PromptForge"
- **Floating Button**: Select text in input fields to see a floating enhance button
- **Keyboard Shortcuts**:
  - `Ctrl+Shift+E` (Mac: `Cmd+Shift+E`) - Enhance selected text
  - `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`) - Open quick enhancer popup
- **Auto-Copy**: Enhanced prompts are automatically copied to clipboard
- **History**: Saves your last 50 enhancements locally
- **Multiple Models**: Choose from Claude Opus, Sonnet, or Haiku models
- **Enhancement Levels**: Light, Standard, or Comprehensive enhancement

## Installation

### Chrome/Edge (Developer Mode)

1. Download or clone this repository
2. Open Chrome/Edge and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked"
5. Select the `extension` folder
6. The PromptForge icon should appear in your extensions toolbar

### Firefox (Coming Soon)

Firefox support is planned for a future release.

## Usage

### Method 1: Popup Interface

1. Click the PromptForge icon in your toolbar
2. Type or paste your prompt
3. Select model and enhancement level
4. Click "Enhance Prompt"
5. Copy or insert the enhanced result

### Method 2: Context Menu

1. Select any text on a webpage
2. Right-click and choose "Enhance with PromptForge"
3. The enhanced prompt is automatically copied to clipboard
4. A notification appears with the result

### Method 3: Keyboard Shortcut

1. Select text in any input field
2. Press `Ctrl+Shift+E` (Mac: `Cmd+Shift+E`)
3. The text is enhanced and copied automatically

### Method 4: Floating Button

1. Select text in a textarea or input field
2. A floating "✨ Enhance" button appears
3. Click it to enhance the selected text

## Settings

Click the gear icon in the popup to access settings (coming soon):
- Set default model
- Set default enhancement level
- Manage keyboard shortcuts
- View enhancement history

## Supported AI Platforms

PromptForge works on all websites, including:
- ChatGPT (chat.openai.com)
- Claude.ai
- Google Gemini
- Perplexity
- Any other AI chat interface
- Google Docs, Notion, and other text editors

## Privacy

- All data is stored locally on your device
- No data is sent to PromptForge servers except for enhancement requests
- Enhancement history is saved locally (last 50 items)
- You can clear history at any time

## API Configuration

By default, the extension uses the public PromptForge API at:
```
https://promptforge.vercel.app/api/enhance
```

If you're self-hosting PromptForge, you can update the API URL in `popup/popup.js` and `background/background.js`.

## Development

### File Structure

```
extension/
├── manifest.json           # Extension configuration
├── popup/
│   ├── popup.html         # Popup interface
│   ├── popup.css          # Popup styles
│   └── popup.js           # Popup logic
├── background/
│   └── background.js      # Background service worker
├── content/
│   ├── content.js         # Content script (webpage interaction)
│   └── content.css        # Content script styles
└── icons/
    ├── icon16.png         # 16x16 icon
    ├── icon48.png         # 48x48 icon
    └── icon128.png        # 128x128 icon
```

### Local Development

1. Make changes to the extension files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the PromptForge extension
4. Test your changes

### Building for Production

1. Update version number in `manifest.json`
2. Create icons (16x16, 48x48, 128x128)
3. Test thoroughly on Chrome and Edge
4. Zip the `extension` folder
5. Submit to Chrome Web Store

## Roadmap

- [ ] Settings page
- [ ] Enhancement history view
- [ ] Templates and presets
- [ ] Community-shared prompts
- [ ] Firefox support
- [ ] Direct ChatGPT/Claude.ai integration
- [ ] Auto-enhance mode
- [ ] Comparison view (original vs enhanced)
- [ ] Chrome Web Store listing

## Support

For issues or feature requests:
- GitHub: https://github.com/sven-stack/promptforge
- Web App: https://promptforge.vercel.app

## License

MIT License - See LICENSE file for details

---

Made with ❤️ by the PromptForge team
