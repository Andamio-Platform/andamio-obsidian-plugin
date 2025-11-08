# Quick Start: Deploying to Obsidian Community Plugins

**TL;DR** - 5 main steps to get this plugin published.

## 1. Prepare Repository (30 min)

```bash
# Ensure repo is public on GitHub
# Update manifest.json with final details
# Add LICENSE file if needed
# Commit everything
git add .
git commit -m "Prepare for release"
git push origin main
```

**Files needed**:
- ✅ manifest.json
- ✅ README.md
- ✅ package.json
- ✅ versions.json
- ⚠️  LICENSE (add if missing)

## 2. Build & Test (1 hour)

```bash
# Build production version
npm run build

# Test in Obsidian vault
# - Copy main.js and manifest.json to test vault
# - Test all functionality
# - Fix any issues
```

## 3. Create GitHub Release (15 min)

```bash
# Update version in manifest.json to 1.0.0 (or appropriate version)
# Update version in package.json to match
# Update versions.json

# Commit and tag
git add .
git commit -m "Release v1.0.0"
git tag -a 1.0.0 -m "Release version 1.0.0"
git push origin main
git push origin 1.0.0
```

On GitHub:
1. Go to Releases → Create new release
2. Choose tag `1.0.0`
3. Title: "v1.0.0 - Initial Release"
4. **Attach files**: `main.js`, `manifest.json`
5. Write release notes
6. Publish release

## 4. Submit to Obsidian (30 min)

```bash
# Fork obsidianmd/obsidian-releases
git clone https://github.com/YOUR_ORG/obsidian-releases.git
cd obsidian-releases

# Edit community-plugins.json, add:
{
  "id": "andamio-obsidian-plugin",
  "name": "Andamio",
  "author": "Andamio",
  "description": "Read data from Andamio APIs and create Markdown files in your vault",
  "repo": "YOUR_ORG/andamio-obsidian-plugin"
}

# Commit and push
git add community-plugins.json
git commit -m "Add Andamio plugin"
git push origin main
```

Create PR from your fork to `obsidianmd/obsidian-releases`

## 5. Wait for Approval (1-4 weeks)

- Obsidian team reviews PR
- Respond to any feedback
- Once approved, plugin appears in Community Plugins directory

---

## After Approval

Future updates are easy:
1. Update version in `manifest.json` and `package.json`
2. Update `versions.json`
3. Build: `npm run build`
4. Create new GitHub release with updated files
5. Done! (No PR needed - Obsidian auto-pulls from your releases)

---

## Manual Installation (Before Approval)

Users can install manually:
1. Download `main.js` and `manifest.json` from GitHub release
2. Create folder: `{vault}/.obsidian/plugins/andamio-obsidian-plugin/`
3. Copy files to that folder
4. Reload Obsidian and enable plugin

---

## Helpful Commands

```bash
# Development
npm run dev          # Build with watch mode

# Production
npm run build        # Production build

# Version bump (updates manifest and versions.json)
npm version patch    # 1.0.0 → 1.0.1
npm version minor    # 1.0.0 → 1.1.0
npm version major    # 1.0.0 → 2.0.0
```

---

## Important Notes

⚠️ **Before submitting**:
- This plugin requires a local API (http://localhost:3000)
- Document this clearly in README
- Consider making it configurable for production

⚠️ **Security**:
- Don't commit `main.js` to repo (only attach to releases)
- Keep `node_modules` in .gitignore
- Verify no API keys or secrets in code

⚠️ **Support**:
- Be ready to respond to GitHub issues
- Monitor the PR for review comments
- Keep documentation updated

---

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.
See [.github/RELEASE_CHECKLIST.md](./.github/RELEASE_CHECKLIST.md) for full checklist.
