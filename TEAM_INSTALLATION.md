# Team Installation Guide

This guide is for installing the Andamio Obsidian Plugin. Your team can start using it immediately.

## Option 1: Install from GitHub Release (Recommended for Users)

### For You (Releasing)

1. **Build the plugin**:
```bash
cd /Users/james/projects/01-projects/andamio-obsidian-plugin
npm install
npm run build
```

2. **Create a GitHub release** (or just share the files):
   - The build creates `main.js` in the root directory
   - You already have `manifest.json`
   - Either create a GitHub release OR just share these files directly with your team

### For Your Team (Installing)

**Step 1: Download the Release Files**

1. Go to the [Releases page](https://github.com/Andamio-Platform/andamio-obsidian-plugin/releases)
2. Click on the latest release
3. Download both files from the "Assets" section:
   - `main.js`
   - `manifest.json`

**Step 2: Install in Obsidian**

1. Open your Obsidian vault folder in Finder/Explorer
2. Navigate to or create: `.obsidian/plugins/andamio-obsidian-plugin/`
   - On Mac: Show hidden files with `Cmd + Shift + .`
   - Full path example: `/path/to/vault/.obsidian/plugins/andamio-obsidian-plugin/`
3. Copy the downloaded `main.js` and `manifest.json` into that folder
4. Restart Obsidian (or reload with `Ctrl/Cmd + R`)

**Step 3: Enable the Plugin**

1. Open Obsidian Settings (gear icon)
2. Go to **Community Plugins**
3. Find "Andamio" in the installed plugins list
4. Toggle it **on**

**Step 4: Configure**

1. Still in Settings, click on **Andamio** in the plugin list
2. Configure:
   - **API Base URL**: `http://localhost:3000` (or your API URL)
   - **Target Folder**: `Andamio` (or where you want files saved)

**Step 5: Use It**

1. Click the **download icon** in the left sidebar ribbon
2. Or open **Command Palette** (`Cmd/Ctrl + P`) → type "Fetch Andamio content"
3. Enter:
   - Course NFT Policy ID
   - Module Code
4. Click **Fetch**
5. Files will be created in your vault!

## Option 2: Git Clone/Symlink (For Developers)

If your team wants to contribute or modify the plugin:

### For Each Team Member

1. **Clone the repo**:
```bash
cd ~/projects/01-projects
git clone https://github.com/Andamio-Platform/andamio-obsidian-plugin.git
# OR if they already have access:
# Just pull latest: git pull
```

2. **Install dependencies and build**:
```bash
cd andamio-obsidian-plugin
npm install
npm run dev  # This watches for changes
```

3. **Symlink to their vault**:
```bash
# Create symlink from vault to dev folder
ln -s ~/projects/01-projects/andamio-obsidian-plugin /path/to/their/vault/.obsidian/plugins/andamio-obsidian-plugin
```

4. **Enable and reload** (same as Option 1 steps 3-5)

**Benefit**: Changes to code automatically rebuild (because of `npm run dev`) and they can reload Obsidian to see changes.

## Option 3: Direct Shared Folder (Simple, Less Ideal)

If you want the simplest approach:

1. **Build once**:
```bash
npm run build
```

2. **Share the entire plugin folder**:
   - Zip the entire `andamio-obsidian-plugin` folder
   - Share via Google Drive, Dropbox, Slack, etc.

3. **Team members extract**:
```bash
# Extract to their vault's plugins folder
unzip andamio-obsidian-plugin.zip -d /path/to/vault/.obsidian/plugins/
```

**Downside**: They need to re-download the whole folder for each update.

## Keeping Everyone Updated

### For Ongoing Development

**If using GitHub** (Option 1 or 2):
1. Make changes to the code
2. Build: `npm run build`
3. Commit and push
4. Team pulls latest changes
5. If using Option 1: share new `main.js`
6. If using Option 2: they just `git pull` and reload Obsidian

**If using shared files** (Option 3):
1. Rebuild and re-share the folder each time

## Prerequisites for Team

Everyone needs:
- Obsidian installed
- The Andamio API running at `http://localhost:3000` (or whatever URL you configure)
- Their vault with Community Plugins enabled

## Testing Setup

Before rolling out to the team, test with one person:
1. Have them install using Option 1
2. Verify it works in their environment
3. Then roll out to everyone else

## Troubleshooting

### Plugin doesn't appear in Obsidian
- Make sure the folder is named exactly `andamio-obsidian-plugin`
- Verify `manifest.json` and `main.js` are in that folder
- Restart Obsidian completely (not just reload)
- Check Settings → Community Plugins → Enable "Community plugins"

### "This plugin failed to load"
- The `main.js` might be corrupted or not built correctly
- Try rebuilding: `npm run build`
- Check console (Ctrl/Cmd + Shift + I) for errors

### API connection fails
- Verify the API is running at the configured URL
- Check the API Base URL in Settings → Andamio
- Test the API directly: `curl http://localhost:3000/api/openapi/lessons/by-module/722deb04bb4696b746b5a16aa19e5bb27c30a51e89989513a84ec9ec/101`

### Files not created
- Check folder permissions
- Verify the target folder name is valid
- Check Obsidian console for errors

## Quick Command Reference

```bash
# Build for distribution
npm run build

# Build with watch mode (for development)
npm run dev

# Check what files were built
ls -la main.js manifest.json

# Zip for sharing (if needed)
zip -r andamio-plugin.zip main.js manifest.json
```

## Private GitHub Repo Workflow

If your repo is private and your team has access:

1. **Create a release** (even in private repo):
   - Build the plugin
   - Create a new release on GitHub
   - Attach `main.js` and `manifest.json`

2. **Team downloads**:
   - Go to Releases page
   - Download the files
   - Install per Option 1

3. **Updates**:
   - Create new releases with updated files
   - Team downloads and replaces files
   - Reload Obsidian

**Benefit**: Version tracking, easy to see what changed, team can pick which version to use.

## Example: First Time Setup Email to Team

```
Hey team,

The Andamio Obsidian Plugin is ready! Here's how to install:

1. Download these files: [link to main.js and manifest.json]
2. Go to your Obsidian vault folder
3. Create this folder: .obsidian/plugins/andamio-obsidian-plugin
4. Put the downloaded files in that folder
5. Restart Obsidian
6. Go to Settings → Community Plugins
7. Enable "Andamio"
8. Configure in Settings → Andamio (set your API URL if needed)

To use:
- Click the download icon in left sidebar
- Enter course NFT policy ID and module code
- Done!

Let me know if you hit any issues!
```

## Next Steps

- **Now**: Share with team using one of the options above
- **Later**: If you want public distribution, follow DEPLOYMENT.md
- **Anytime**: Team can use the plugin whether it's approved or not

---

**Remember**: Community Plugin approval is only for getting listed in Obsidian's public directory. It's not required for your team to use the plugin!
