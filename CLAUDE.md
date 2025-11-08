# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Obsidian plugin that fetches lesson data from Andamio APIs and creates/updates Markdown files in the user's vault. The plugin:
- Fetches lessons from a single Andamio API endpoint (lessons by module)
- Uses an interactive modal dialog for entering course and module parameters
- Parses ProseMirror/TipTap JSON content (from Novel editor) into Markdown
- Creates a module index file and individual lesson files
- Provides on-demand fetching via ribbon icon or command palette

**Note**: The API currently runs locally without authentication (this is acceptable for development).

## Development Commands

### Setup
```bash
npm install
```

### Build Commands
```bash
# Development mode with hot reload (watches for changes)
npm run dev

# Production build (type-checks then bundles)
npm run build

# Version bump (updates manifest.json and versions.json)
npm version <major|minor|patch>
```

### Testing the Plugin
To test during development:
1. Create or use a test vault
2. Clone/link this repo to `.obsidian/plugins/andamio-obsidian-plugin` in that vault
3. Run `npm install` and `npm run dev`
4. Enable the plugin in Obsidian Settings > Community Plugins
5. Reload Obsidian when making changes (Ctrl/Cmd + R or restart)

## Architecture

### Core Files
- **main.ts**: Plugin entry point, contains the main `AndamioPlugin` class and settings tab
- **manifest.json**: Plugin metadata (id, version, description, compatibility)
- **esbuild.config.mjs**: Build configuration that bundles TypeScript into a single main.js

### Plugin Structure
The plugin follows standard Obsidian plugin architecture:

1. **AndamioPlugin class**: Main plugin class extending Obsidian's `Plugin`
   - `onload()`: Initialization, registers commands and ribbon icon
   - `openFetchModal()`: Opens modal dialog for user input
   - `fetchAndamioData()`: Core method to fetch API data and create markdown files (accepts parameters)
   - `createOrUpdateMarkdownFile()`: Utility to create or modify files in the vault

2. **FetchContentModal class**: Modal dialog for user input extending `Modal`
   - Prompts user to enter Course NFT Policy ID and Module Code
   - Calls back to plugin with entered values

3. **AndamioSettingTab class**: Settings UI extending `PluginSettingTab`
   - Provides configuration interface for API base URL and target folder

4. **Settings Interface**: `AndamioPluginSettings`
   - `apiBaseUrl`: Base URL for Andamio API endpoints (default: `http://localhost:3000`)
   - `targetFolder`: Vault folder where markdown files will be saved (default: `Andamio`)

### Code Organization
- **src/api/andamioClient.ts**: API client for fetching lesson data
  - `AndamioClient`: HTTP client using Obsidian's `requestUrl`
  - `getLessonsByModule()`: Fetches lessons for a given course and module

- **src/types/andamio.ts**: TypeScript interfaces for API responses
  - `AndamioModuleResponse`: Top-level API response
  - `Lesson`: Individual lesson data
  - `ContentDoc`, `ContentNode`, `Mark`: ProseMirror/TipTap document structure

- **src/ui/FetchContentModal.ts**: Modal dialog for user input
  - `FetchContentModal`: Modal for entering course NFT policy ID and module code
  - Accepts callback function that receives user input

- **src/utils/contentParser.ts**: Converts ProseMirror JSON to Markdown
  - `ContentParser`: Recursive parser for ProseMirror/TipTap content
  - Handles: headings, paragraphs, code blocks, lists, images, text formatting
  - Supports marks: bold, italic, code, links, text styles

- **src/utils/markdownGenerator.ts**: Generates markdown files from lesson data
  - `generateLessonMarkdown()`: Creates markdown with YAML frontmatter
  - `generateModuleIndex()`: Creates index file with wikilinks to lessons
  - `generateLessonFilename(lessonIndex)`: Creates numeric filename (1-based indexing)
  - `generateModuleIndexFilename()`: Returns "index.md"

### User Flow
1. User clicks ribbon icon (download) or uses Command Palette → "Fetch Andamio content"
2. `FetchContentModal` opens, prompting for Course NFT Policy ID and Module Code
3. User enters values and clicks "Fetch"
4. Modal calls `fetchAndamioData()` with the entered parameters
5. Plugin fetches data, creates/updates files, and shows success notice

### API Integration
The `fetchAndamioData()` method in main.ts:66:
1. Accepts courseNftPolicyId and moduleCode as parameters
2. Fetches module data via `AndamioClient.getLessonsByModule()`
3. Creates nested folder structure: `{targetFolder}/{courseNftPolicyId}/{moduleCode}/`
4. Creates module index file (`index.md`) with wikilinks to all lessons
5. Creates/updates individual lesson files with numeric names (1-based): `1.md`, `2.md`, `3.md`, etc.
6. Shows success notice with count of created/updated files

**Endpoint**: `GET /api/openapi/lessons/by-module/{courseNftPolicyId}/{moduleCode}`

**Folder Structure Example**:
```
Andamio/
  722deb04bb4696b746b5a16aa19e5bb27c30a51e89989513a84ec9ec/
    101/
      index.md
      1.md
      2.md
      3.md
    102/
      index.md
      1.md
      2.md
```

### File Operations
The plugin uses Obsidian's Vault API:
- `this.app.vault.getAbstractFileByPath(path)`: Check if file exists
- `this.app.vault.create(path, content)`: Create new file
- `this.app.vault.modify(file, content)`: Update existing file

Paths should be relative to vault root.

**File Naming Convention**:
- Course folders use the full NFT policy ID
- Module folders use the module code (e.g., "101", "102")
- Lesson files use 1-based numeric indexing (1.md, 2.md, 3.md...)
- Module index is always named "index.md"

### Content Parsing

Lessons contain a `contentJson` field with ProseMirror/TipTap document structure (produced by Novel editor). The parser in `src/utils/contentParser.ts` converts this to markdown:

**Supported Node Types:**
- `heading`: Converted to `#`, `##`, etc. based on level
- `paragraph`: Plain text with inline formatting
- `codeBlock`: Fenced code blocks with language (` ```language `)
- `orderedList`/`bulletList`: Numbered and bulleted lists with nesting support
- `listItem`: List items (can contain nested lists)
- `imageBlock`: Markdown images `![alt](src)`
- `text`: Text content with optional marks

**Supported Marks (inline formatting):**
- `bold`: `**text**`
- `italic`: `*text*`
- `code`: `` `text` ``
- `link`: `[text](href)`
- `textStyle`: Ignored (no markdown equivalent for colors)

The parser is recursive and handles nested structures (like nested lists) correctly.

## Build System

The plugin uses esbuild for fast bundling:
- Bundles all TypeScript files into a single `main.js`
- Externals: Obsidian API, Electron, and CodeMirror packages (provided by Obsidian)
- Development mode: inline sourcemaps and watch mode
- Production mode: minified, no sourcemaps

TypeScript compilation is checked separately (via `tsc -noEmit`) before production builds.

## Settings Persistence

Plugin settings are automatically persisted by Obsidian:
- `loadData()`: Loads saved settings from `data.json` in plugin folder
- `saveData()`: Saves settings to `data.json`
- Settings are merged with defaults on load to handle new properties

## Obsidian API Patterns

### Commands
```typescript
this.addCommand({
    id: 'unique-command-id',
    name: 'Display name in command palette',
    callback: async () => { /* action */ }
});
```

### Ribbon Icons
```typescript
this.addRibbonIcon('icon-name', 'Tooltip text', async () => {
    /* action */
});
```

### Intervals
```typescript
this.registerInterval(
    window.setInterval(() => this.action(), intervalMs)
);
```

### Notices
```typescript
new Notice('Message to user');
```

## Version Management

When ready to release a new version:
1. Update version in `package.json`
2. Run `npm version <major|minor|patch>` (automatically updates manifest.json and versions.json)
3. Create a GitHub release with the tag
4. Attach `main.js`, `manifest.json`, and `styles.css` (if exists) to the release

## Deployment

For deploying this plugin to the Obsidian Community Plugins directory:
- **Quick Start**: See [QUICK_START_DEPLOYMENT.md](./QUICK_START_DEPLOYMENT.md) for a 5-step overview
- **Detailed Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment instructions
- **Release Checklist**: See [.github/RELEASE_CHECKLIST.md](./.github/RELEASE_CHECKLIST.md) before each release

**GitHub Actions**: A workflow is configured in `.github/workflows/release.yml` to automatically build and attach files when you push a version tag.
