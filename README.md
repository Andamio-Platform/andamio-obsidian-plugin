# Andamio Obsidian Plugin

An Obsidian plugin that fetches lesson data from Andamio APIs and creates Markdown files in your vault.

## Features

- Fetch lessons from Andamio API (by course and module)
- Parse ProseMirror/TipTap JSON content (from Novel editor) to Markdown
- Create module index file with wikilinks to lessons
- Automatically create and update individual lesson Markdown files
- Interactive modal for entering course and module parameters
- Fetch via ribbon icon or command palette
- YAML frontmatter on all lesson files

## Installation

### Manual Installation

1. Download the latest release from the [Releases page](https://github.com/Andamio-Platform/andamio-obsidian-plugin/releases)
2. Download `main.js` and `manifest.json` from the release assets
3. In your Obsidian vault, create the folder: `.obsidian/plugins/andamio-obsidian-plugin/`
4. Copy `main.js` and `manifest.json` into that folder
5. Restart Obsidian (or reload with Ctrl/Cmd + R)
6. Go to Settings → Community Plugins
7. Enable "Andamio"

### Community Plugins (Future)

This plugin may be submitted to Obsidian's Community Plugins directory in the future. If approved, it will be available directly within Obsidian's plugin browser.

## Development

### Setup

```bash
npm install
```

### Build

```bash
# Development mode with hot reload
npm run dev

# Production build
npm run build
```

### Installation for Development

1. Clone this repo or create a symlink to `.obsidian/plugins/andamio-obsidian-plugin` in your test vault
2. Run `npm install`
3. Run `npm run dev`
4. Enable the plugin in Obsidian settings

### Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on publishing this plugin to the Obsidian Community Plugins directory.

## Usage

1. Click the download icon in the ribbon (left sidebar) or use Command Palette → "Fetch Andamio content"
2. Enter the following in the modal dialog:
   - **Course NFT Policy ID**: The NFT policy ID for your course (e.g., `722deb04bb4696b746b5a16aa19e5bb27c30a51e89989513a84ec9ec`)
   - **Module Code**: The module code to fetch (e.g., `101`)
3. Click "Fetch" - the plugin will create/update files in your target folder

## Settings

Configure the plugin in Settings > Andamio:

- **API Base URL**: Base URL for Andamio API (default: `http://localhost:3000`)
- **Target Folder**: Folder where Andamio data will be saved (default: `Andamio`)

## How It Works

1. User enters course NFT policy ID and module code in a modal dialog
2. The plugin fetches lesson data from: `GET /api/openapi/lessons/by-module/{courseNftPolicyId}/{moduleCode}`
3. Parses the ProseMirror/TipTap `contentJson` into Markdown
4. Creates a nested folder structure: `{targetFolder}/{courseNftPolicyId}/{moduleCode}/`
5. Creates a module index file (`index.md`) with wikilinks to all lessons
6. Creates individual lesson files named by their index (1-based): `1.md`, `2.md`, `3.md`, etc.
   - YAML frontmatter (id, title, module, moduleCode, description)
   - Markdown content converted from ProseMirror JSON

## Folder Structure

```
Andamio/
  722deb04bb4696b746b5a16aa19e5bb27c30a51e89989513a84ec9ec/
    101/
      index.md
      1.md
      2.md
      3.md
      ...
    102/
      index.md
      1.md
      2.md
      ...
```

## Example Output

### Module Index File (`index.md`)
```markdown
---
moduleTitle: "Getting Started with Aiken"
moduleCode: "101"
lessonCount: 5
---

# Getting Started with Aiken

Module Code: 101

## Lessons

1. [[1|Prepare Your Aiken Dev Environment]]
2. [[2|Write Your First Validator]]
3. [[3|Understanding Aiken Syntax]]
...
```

### Lesson File (`1.md`)
```markdown
---
id: cm23e47lz00075lrvd7acpzch
title: "Prepare Your Aiken Dev Environment"
module: "Getting Started with Aiken"
moduleCode: "101"
description: "1. Install VSCode\n2. Install Aiken..."
---

# Prepare Your Aiken Dev Environment

## Prerequisites

In this course, we assume that you have [Visual Studio Code](https://code.visualstudio.com/)...
```

## License

MIT
