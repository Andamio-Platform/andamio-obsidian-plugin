# Deployment Plan: Andamio Obsidian Plugin

This document outlines the steps to deploy the Andamio Obsidian Plugin as an official Obsidian Community Plugin.

## Prerequisites

Before deploying, ensure you have:
- [x] A GitHub repository for this plugin (public)
- [ ] A GitHub account with permissions to create releases
- [ ] The plugin is fully tested and working
- [ ] All documentation is complete and accurate
- [ ] A clear versioning strategy (we'll use semantic versioning)

## Phase 1: Repository Preparation

### 1.1 Create Public GitHub Repository

If not already done:
```bash
cd /Users/james/projects/01-projects/andamio-obsidian-plugin

# Initialize git if needed
git init

# Add remote repository
git remote add origin https://github.com/YOUR_ORG/andamio-obsidian-plugin.git

# Push to GitHub
git add .
git commit -m "Initial commit: Andamio Obsidian Plugin"
git push -u origin main
```

### 1.2 Add Required Repository Files

Ensure these files exist in the repository root:
- [x] `manifest.json` - Plugin metadata (already exists)
- [x] `README.md` - Plugin documentation (already exists)
- [x] `LICENSE` - License file (create if needed)
- [ ] `.github/workflows/release.yml` - GitHub Actions workflow for automated builds (optional but recommended)

### 1.3 Review and Update manifest.json

Current manifest.json should have:
```json
{
	"id": "andamio-obsidian-plugin",
	"name": "Andamio",
	"version": "1.0.0",
	"minAppVersion": "0.15.0",
	"description": "Read data from Andamio APIs and create Markdown files in your vault",
	"author": "YOUR_NAME or Andamio",
	"authorUrl": "https://andamio.io",
	"isDesktopOnly": false
}
```

**Action Items**:
- Update `version` to `1.0.0` (or appropriate starting version)
- Verify `author` and `authorUrl`
- Confirm `description` is clear and concise
- Verify `minAppVersion` is correct

### 1.4 Add LICENSE File

Create a LICENSE file (MIT is common for Obsidian plugins):

```bash
# Create MIT License file
cat > LICENSE << 'EOF'
MIT License

Copyright (c) 2024 Andamio

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF
```

## Phase 2: Build and Test

### 2.1 Production Build

```bash
# Install dependencies
npm install

# Run production build
npm run build

# Verify the following files are created:
# - main.js (bundled plugin code)
# - manifest.json (plugin metadata)
```

### 2.2 Test in Obsidian

Before releasing, thoroughly test:
1. Install the built plugin in a test vault
2. Test fetching content from the API
3. Verify folder structure is correct
4. Verify markdown parsing works correctly
5. Test with different courses and modules
6. Check for any errors in the console

### 2.3 Update versions.json

Ensure `versions.json` has the correct mapping:
```json
{
	"1.0.0": "0.15.0"
}
```

This maps plugin version to minimum Obsidian version required.

## Phase 3: Create GitHub Release

### 3.1 Tag the Release

```bash
# Commit all changes
git add .
git commit -m "Release v1.0.0"

# Create and push tag
git tag -a 1.0.0 -m "Release version 1.0.0"
git push origin main
git push origin 1.0.0
```

### 3.2 Create GitHub Release

1. Go to GitHub repository
2. Click "Releases" → "Create a new release"
3. Choose the tag you just created (1.0.0)
4. Set release title: "v1.0.0 - Initial Release"
5. Write release notes (example below)
6. **Attach the following files** to the release:
   - `main.js`
   - `manifest.json`
   - `styles.css` (if you have one)

**Example Release Notes**:
```markdown
## Andamio Obsidian Plugin v1.0.0

Initial release of the Andamio Obsidian Plugin.

### Features
- Fetch lessons from Andamio API by course and module
- Parse ProseMirror/TipTap JSON content to Markdown
- Organized folder structure: `{targetFolder}/{courseNftPolicyId}/{moduleCode}/`
- Numeric lesson file names (1.md, 2.md, 3.md...)
- Module index files with wikilinks
- Interactive modal for entering course parameters

### Installation
Until this plugin is approved for the Community Plugin directory, you can install it manually:
1. Download `main.js` and `manifest.json` from this release
2. Create folder `{vault}/.obsidian/plugins/andamio-obsidian-plugin/`
3. Copy the files into that folder
4. Reload Obsidian
5. Enable the plugin in Settings > Community Plugins

### Requirements
- Obsidian v0.15.0 or higher
- Andamio API running (default: http://localhost:3000)
```

## Phase 4: Submit to Obsidian Community Plugins

### 4.1 Fork the Obsidian Releases Repository

1. Go to https://github.com/obsidianmd/obsidian-releases
2. Click "Fork" to create a fork in your organization/account

### 4.2 Add Your Plugin to community-plugins.json

1. Clone your fork:
```bash
git clone https://github.com/YOUR_ORG/obsidian-releases.git
cd obsidian-releases
```

2. Edit `community-plugins.json` and add your plugin entry (alphabetically):
```json
{
	"id": "andamio-obsidian-plugin",
	"name": "Andamio",
	"author": "Andamio",
	"description": "Read data from Andamio APIs and create Markdown files in your vault",
	"repo": "YOUR_ORG/andamio-obsidian-plugin"
}
```

3. Commit and push:
```bash
git add community-plugins.json
git commit -m "Add Andamio plugin"
git push origin main
```

### 4.3 Create Pull Request

1. Go to your fork on GitHub
2. Click "Pull Request"
3. Create PR from your fork to `obsidianmd/obsidian-releases`
4. Title: "Add Andamio plugin"
5. Description should include:
   - What the plugin does
   - Link to your plugin's GitHub repo
   - Any special considerations

**Example PR Description**:
```markdown
## Plugin Submission: Andamio

**Repository**: https://github.com/YOUR_ORG/andamio-obsidian-plugin

### Description
Andamio is a plugin that fetches lesson data from Andamio APIs and creates organized Markdown files in the user's vault. It parses ProseMirror/TipTap JSON content and creates a hierarchical folder structure for courses, modules, and lessons.

### Features
- Fetch lessons from Andamio API by course and module
- Parse ProseMirror/TipTap JSON to Markdown
- Organized folder structure
- Interactive modal for input

### Checklist
- [x] Plugin has been tested in Obsidian
- [x] README.md provides clear usage instructions
- [x] manifest.json is properly configured
- [x] GitHub release includes main.js and manifest.json
- [x] Plugin follows Obsidian plugin guidelines
```

## Phase 5: Review Process

### 5.1 What to Expect

After submitting the PR:
1. Obsidian team will review your plugin
2. They may request changes or ask questions
3. Review can take several days to weeks
4. Once approved, your plugin will appear in the Community Plugins directory

### 5.2 Respond to Feedback

Be prepared to:
- Answer questions about functionality
- Make requested changes to code or documentation
- Update the PR if needed
- Be patient and professional

## Phase 6: Post-Approval

### 6.1 Once Approved

After your PR is merged:
1. Users can find your plugin in Obsidian's Community Plugins browser
2. They can install it directly from Obsidian
3. Updates will be distributed through the Community Plugins system

### 6.2 Future Updates

For subsequent releases:
1. Update version in `manifest.json` and `package.json`
2. Update `versions.json` with new version mapping
3. Run `npm run build`
4. Create new GitHub release with updated files
5. Users will be notified of updates within Obsidian

**No need to submit another PR** - updates are automatically pulled from your GitHub releases.

## Phase 7: User Installation (After Approval)

Once approved, users can install your plugin:

### From Obsidian (Recommended)
1. Open Obsidian Settings
2. Go to Community Plugins
3. Click "Browse"
4. Search for "Andamio"
5. Click "Install"
6. Enable the plugin

### Manual Installation (Before Approval)
1. Download `main.js` and `manifest.json` from latest GitHub release
2. Create folder `{vault}/.obsidian/plugins/andamio-obsidian-plugin/`
3. Copy files into that folder
4. Reload Obsidian
5. Enable in Settings > Community Plugins

## Checklist Summary

Before submitting:
- [ ] Repository is public on GitHub
- [ ] `manifest.json` is complete and accurate
- [ ] `README.md` has clear installation and usage instructions
- [ ] `LICENSE` file exists
- [ ] Plugin is thoroughly tested
- [ ] Production build succeeds (`npm run build`)
- [ ] GitHub release created with `main.js` and `manifest.json` attached
- [ ] Version numbers are consistent across files
- [ ] PR submitted to obsidianmd/obsidian-releases

## Additional Resources

- [Obsidian Plugin Guidelines](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines)
- [Obsidian Developer Docs](https://docs.obsidian.md/)
- [Sample Plugin](https://github.com/obsidianmd/obsidian-sample-plugin)
- [Community Plugins Repo](https://github.com/obsidianmd/obsidian-releases)

## Notes

**Important Considerations**:
1. **API Dependency**: This plugin currently relies on a locally running API. Consider documenting this clearly for users, or making the API URL more configurable for production use.

2. **Testing**: Ensure the plugin works well even when the API is not available (proper error handling).

3. **Privacy**: Since this involves API calls, consider adding information about data privacy in your README.

4. **Support**: Be prepared to provide support through GitHub issues once the plugin is public.

## Timeline Estimate

- Repository setup: 1 hour
- Testing and refinement: 2-4 hours
- Creating release: 30 minutes
- PR submission: 30 minutes
- Review process: 1-4 weeks (depends on Obsidian team)
- Total before approval: ~1 day of work + waiting period
