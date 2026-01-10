# PromptForge Browser Extension - Installation Guide

## Quick Start (Chrome/Edge)

### Step 1: Load the Extension

1. **Open Extension Management Page**
   - **Chrome**: Navigate to `chrome://extensions/`
   - **Edge**: Navigate to `edge://extensions/`

2. **Enable Developer Mode**
   - Look for the "Developer mode" toggle in the top-right corner
   - Click to enable it

3. **Load Unpacked Extension**
   - Click the "Load unpacked" button
   - Navigate to your `PromptForge` project folder
   - Select the `extension` folder (not the root folder!)
   - Click "Select Folder"

4. **Verify Installation**
   - You should see the PromptForge extension card appear
   - The PromptForge icon should appear in your browser toolbar
   - If you don't see the icon, click the puzzle piece (extensions) icon and pin PromptForge

### Step 2: Test the Extension

#### Method 1: Popup Interface
1. Click the PromptForge icon in your toolbar
2. Type a simple prompt like: `help me write an email`
3. Click "Enhance Prompt"
4. Wait a few seconds for the API response
5. You should see the original and enhanced versions

#### Method 2: Context Menu
1. Go to any webpage
2. Select some text (e.g., "write a cover letter")
3. Right-click and choose "Enhance with PromptForge"
4. A notification will appear with the enhanced prompt
5. The enhanced prompt is automatically copied to your clipboard

#### Method 3: Keyboard Shortcut
1. Go to any webpage with a text input
2. Type some text in a textarea
3. Select the text
4. Press `Ctrl+Shift+E` (Windows/Linux) or `Cmd+Shift+E` (Mac)
5. The enhanced prompt will be copied to your clipboard

#### Method 4: Floating Button
1. Go to any webpage with a text input
2. Click in a textarea and type some text
3. Select the text with your mouse
4. A floating "✨ Enhance" button should appear
5. Click it to enhance the selected text

## Troubleshooting

### Extension Not Loading
- **Problem**: Extension won't load or shows errors
- **Solution**:
  - Make sure you selected the `extension` folder, not the root folder
  - Check that all files exist in the extension folder
  - Look for specific error messages in the Extensions page

### API Errors
- **Problem**: "Enhancement failed" or network errors
- **Solution**:
  - Check your internet connection
  - Verify that `https://promptforge.vercel.app` is accessible
  - Try again in a few seconds (API might be rate-limited)

### Icons Not Showing
- **Problem**: Extension icon is blank or broken
- **Solution**:
  - Check that PNG files exist in `extension/icons/` folder
  - Run `node extension/icons/generate-icons.js` to regenerate
  - Or open `extension/icons/generate-icons.html` in browser and save images manually

### Keyboard Shortcuts Not Working
- **Problem**: Ctrl+Shift+E doesn't work
- **Solution**:
  - Go to `chrome://extensions/shortcuts`
  - Check if the shortcut is assigned to PromptForge
  - Change it if there's a conflict with another extension

### Content Script Not Working
- **Problem**: Floating button or text insertion not working
- **Solution**:
  - Refresh the webpage after installing the extension
  - Some sites (like chrome://extensions) block content scripts
  - Try on a regular website

## Customization

### Change Default Model
1. Open the extension popup
2. Select your preferred model from the dropdown
3. The selection is automatically saved

### Change Default Enhancement Level
1. Open the extension popup
2. Select your preferred level (Light, Standard, or Comprehensive)
3. The selection is automatically saved

### Modify Keyboard Shortcuts
1. Go to `chrome://extensions/shortcuts`
2. Find PromptForge in the list
3. Click the edit icon next to each shortcut
4. Press your desired key combination

## Self-Hosting (Optional)

If you're running PromptForge locally or on your own server:

1. **Update API URL in popup.js**:
   ```javascript
   const API_URL = 'http://localhost:3000/api/enhance';
   ```

2. **Update API URL in background.js**:
   ```javascript
   const response = await fetch('http://localhost:3000/api/enhance', {
   ```

3. **Update manifest.json host_permissions**:
   ```json
   "host_permissions": [
     "http://localhost:3000/*"
   ]
   ```

4. Reload the extension after making changes

## Development

### Making Changes
1. Edit files in the `extension` folder
2. Go to `chrome://extensions/`
3. Click the refresh icon on the PromptForge card
4. Test your changes

### Debugging
1. **Popup Issues**: Right-click the extension icon → "Inspect popup"
2. **Background Issues**: Click "Inspect views: service worker" on extension card
3. **Content Script Issues**: Open DevTools on the webpage (F12)

### Common Files to Edit
- `popup/popup.js` - Popup UI logic
- `popup/popup.css` - Popup styling
- `background/background.js` - Background service worker
- `content/content.js` - Webpage interaction
- `manifest.json` - Extension configuration

## Next Steps

- Read the main [README.md](README.md) for feature details
- Try different enhancement levels to see the differences
- Use keyboard shortcuts for faster workflow
- Share feedback or report issues on GitHub

## Support

For issues, questions, or feature requests:
- GitHub: https://github.com/sven-stack/promptforge
- Web App: https://promptforge.vercel.app

---

Made with ❤️ by the PromptForge team
