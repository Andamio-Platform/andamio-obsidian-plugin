# Release Checklist

Use this checklist before creating a new release.

## Pre-Release Testing

- [ ] Plugin installs correctly in a test vault
- [ ] Ribbon icon appears and opens modal
- [ ] Command palette entry works
- [ ] Modal accepts course NFT policy ID and module code
- [ ] API connection works (http://localhost:3000 or configured URL)
- [ ] Files are created in correct folder structure: `{target}/{policyId}/{module}/`
- [ ] Lesson files are numbered correctly (1.md, 2.md, 3.md...)
- [ ] `index.md` is created with correct wikilinks
- [ ] Markdown parsing works correctly (headings, links, code blocks, lists, images)
- [ ] YAML frontmatter is correct in all files
- [ ] Error handling works (API unavailable, invalid input, etc.)
- [ ] Settings page works correctly
- [ ] No console errors
- [ ] Multiple fetches work (different courses/modules)

## Code Quality

- [ ] TypeScript compiles without errors: `npm run build`
- [ ] No linting errors (if linter is configured)
- [ ] Code follows Obsidian plugin best practices
- [ ] All files are properly formatted

## Documentation

- [ ] README.md is up to date
- [ ] CLAUDE.md reflects current architecture
- [ ] Usage instructions are clear
- [ ] API endpoint documentation is accurate
- [ ] Folder structure examples are correct

## Version Management

- [ ] `manifest.json` version is updated
- [ ] `package.json` version matches manifest
- [ ] `versions.json` includes new version with minimum Obsidian version
- [ ] Version follows semantic versioning (major.minor.patch)

## Repository

- [ ] All changes are committed
- [ ] Commit messages are clear
- [ ] Branch is up to date with main
- [ ] GitHub repository is public
- [ ] LICENSE file exists
- [ ] .gitignore is configured correctly

## Build Artifacts

- [ ] Production build succeeds: `npm run build`
- [ ] `main.js` is generated
- [ ] `main.js` is not too large (check file size)
- [ ] Build includes all necessary dependencies

## Release Notes

- [ ] Release notes are written
- [ ] Features are listed
- [ ] Bug fixes are noted (if any)
- [ ] Breaking changes are highlighted (if any)
- [ ] Installation instructions are included

## GitHub Release

- [ ] Git tag created with correct version (e.g., 1.0.0)
- [ ] Tag pushed to GitHub
- [ ] Release created on GitHub
- [ ] `main.js` attached to release
- [ ] `manifest.json` attached to release
- [ ] `styles.css` attached if it exists
- [ ] Release notes are complete

## First-Time Release Only

- [ ] Plugin entry added to obsidianmd/obsidian-releases fork
- [ ] PR created to obsidianmd/obsidian-releases
- [ ] PR description is complete
- [ ] Ready to respond to review feedback

## Post-Release

- [ ] Verify release files download correctly
- [ ] Test manual installation from release
- [ ] Update any external documentation
- [ ] Announce to team/users (if applicable)

## Notes

**Version Numbers**:
- Major (X.0.0): Breaking changes
- Minor (0.X.0): New features, backwards compatible
- Patch (0.0.X): Bug fixes

**File Sizes**:
- main.js should typically be under 1MB
- If larger, consider why and optimize if needed

**Common Issues**:
- Ensure node_modules is in .gitignore
- Don't commit main.js to repository (only attach to releases)
- Verify all async operations have proper error handling
