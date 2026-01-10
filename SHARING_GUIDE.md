# How to Share PromptForge Extension

## 📦 Distribution Package Created!

Location: `dist/promptforge-extension.tar.gz`

## 🚀 Sharing Methods

### Method 1: Share via File (Easiest)

**Best for:** Friends, team members, small groups

1. **Package is ready in `dist/` folder:**
   - `promptforge-extension.tar.gz` - Compressed package
   - `INSTALL_INSTRUCTIONS.md` - Installation guide

2. **Share both files via:**
   - Email attachment
   - Google Drive / Dropbox
   - Slack / Discord
   - USB drive

3. **Recipients follow:**
   - Extract the `.tar.gz` file
   - Read `INSTALL_INSTRUCTIONS.md`
   - Load as unpacked extension

**Pros:**
- ✅ Instant sharing
- ✅ No registration needed
- ✅ Free

**Cons:**
- ❌ Requires Developer Mode
- ❌ Manual updates
- ❌ Chrome may show warnings

---

### Method 2: Share via GitHub (Open Source)

**Best for:** Public sharing, collaboration, transparency

1. **Repository already exists:**
   ```
   https://github.com/sven-stack/promptforge
   ```

2. **Add installation instructions to README:**
   - Already documented in `extension/README.md`
   - Users can clone and load

3. **Share the GitHub link:**
   ```
   git clone https://github.com/sven-stack/promptforge
   cd promptforge/extension
   ```

4. **Users install from source**

**Pros:**
- ✅ Version control
- ✅ Open collaboration
- ✅ Issue tracking
- ✅ Star/fork metrics

**Cons:**
- ❌ Requires git knowledge
- ❌ Still needs Developer Mode

---

### Method 3: Chrome Web Store (Professional)

**Best for:** Wide distribution, professional use, monetization

#### Requirements:
- **$5 one-time developer registration fee**
- **Google account**
- **Privacy policy (if collecting data)**
- **Promotional images**

#### Steps:

1. **Register as Chrome Web Store Developer:**
   - Go to: https://chrome.google.com/webstore/devconsole
   - Pay $5 registration fee
   - Verify your email

2. **Prepare for submission:**

   a. **Create promotional images:**
   ```
   - Icon: 128x128 (already have!)
   - Small promo tile: 440x280
   - Large promo tile: 920x680
   - Marquee promo: 1400x560
   - Screenshots: 1280x800 or 640x400 (3-5 images)
   ```

   b. **Update manifest for production:**
   - Extension already configured
   - Make sure API URLs point to production

   c. **Create a detailed description:**
   - Already in extension/README.md
   - Add more marketing copy if needed

   d. **Create a privacy policy** (if needed):
   - State what data you collect (none, just API calls)
   - Where it goes (Anthropic API)
   - How users can delete data

3. **Package the extension:**
   ```bash
   cd extension
   zip -r ../promptforge-extension.zip *
   ```

4. **Submit to Chrome Web Store:**
   - Upload the ZIP file
   - Fill in all details
   - Set pricing (free or paid)
   - Submit for review

5. **Wait for review (1-3 days)**

6. **Once approved, share the store link!**

**Pros:**
- ✅ Automatic updates
- ✅ No Developer Mode needed
- ✅ Trusted by users
- ✅ Discoverability
- ✅ Analytics

**Cons:**
- ❌ $5 fee
- ❌ Review process (1-3 days)
- ❌ Must follow strict policies
- ❌ Can be rejected/removed

---

### Method 4: Private Distribution (Enterprise)

**Best for:** Company-wide deployment, managed environments

**Options:**
- **Google Workspace Admin Console** - Deploy to all users
- **Microsoft Intune** - For Edge in enterprise
- **ExtensionInstallForceList** policy

**Requirements:**
- IT admin access
- Enterprise Google Workspace or Microsoft 365

---

## 📋 Recommended Approach

### For Most Users:
**Start with Method 1 (File Sharing)**
- Quick and easy
- Test with small group first
- Gather feedback

### When Ready for Public:
**Move to Method 3 (Chrome Web Store)**
- Professional appearance
- Better user experience
- Wider reach

## 🎨 Chrome Web Store Assets Needed

If you decide to publish, you'll need:

1. **Screenshots** (3-5 images showing the extension in use)
2. **Promo Tiles** (marketing images)
3. **Detailed Description** (already have this!)
4. **Privacy Policy** (simple, can be in GitHub)
5. **Support Email** (for user questions)

## 📝 Next Steps

**Right Now:**
1. ✅ Share `dist/promptforge-extension.tar.gz` with testers
2. ✅ Get feedback
3. ✅ Fix any issues

**Future:**
1. Create promotional images
2. Write privacy policy
3. Register for Chrome Web Store
4. Submit for review
5. Launch! 🚀

## 💡 Tips

- **Start small:** Share with 5-10 people first
- **Gather feedback:** Create a feedback form
- **Iterate:** Fix bugs before wider release
- **Market:** Tweet, post on Product Hunt, share on Reddit
- **Monitor:** Check for errors and user reports

---

## 🔗 Resources

- **Chrome Web Store Developer Dashboard:** https://chrome.google.com/webstore/devconsole
- **Publishing Guide:** https://developer.chrome.com/docs/webstore/publish/
- **Extension Best Practices:** https://developer.chrome.com/docs/extensions/mv3/
- **Our GitHub:** https://github.com/sven-stack/promptforge

---

**Questions?** Open an issue on GitHub or email [your-email]

**Good luck with your launch! 🚀**
