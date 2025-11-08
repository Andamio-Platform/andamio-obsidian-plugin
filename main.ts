import { App, Plugin, PluginSettingTab, Setting, Notice, TFile } from 'obsidian';
import { AndamioClient } from './src/api/andamioClient';
import { MarkdownGenerator } from './src/utils/markdownGenerator';
import { FetchContentModal } from './src/ui/FetchContentModal';

interface AndamioPluginSettings {
	apiBaseUrl: string;
	targetFolder: string;
}

const DEFAULT_SETTINGS: AndamioPluginSettings = {
	apiBaseUrl: 'http://localhost:3000',
	targetFolder: 'Andamio'
}

export default class AndamioPlugin extends Plugin {
	settings: AndamioPluginSettings;
	apiClient: AndamioClient;

	async onload() {
		await this.loadSettings();

		// Initialize API client
		this.apiClient = new AndamioClient(this.settings.apiBaseUrl);

		// Add ribbon icon to fetch content
		this.addRibbonIcon('download', 'Fetch Andamio content', () => {
			this.openFetchModal();
		});

		// Add command to fetch content
		this.addCommand({
			id: 'fetch-andamio-content',
			name: 'Fetch Andamio content',
			callback: () => {
				this.openFetchModal();
			}
		});

		// Add settings tab
		this.addSettingTab(new AndamioSettingTab(this.app, this));
	}

	openFetchModal() {
		new FetchContentModal(this.app, async (result) => {
			if (!result.courseNftPolicyId || !result.moduleCode) {
				new Notice('Andamio: Please enter both Course NFT Policy ID and Module Code');
				return;
			}
			await this.fetchAndamioData(result.courseNftPolicyId, result.moduleCode);
		}).open();
	}

	onunload() {
		// Cleanup handled automatically by Obsidian
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async fetchAndamioData(courseNftPolicyId: string, moduleCode: string) {
		try {
			new Notice('Andamio: Fetching content...');

			// Fetch module data from API
			const moduleData = await this.apiClient.getLessonsByModule(
				courseNftPolicyId,
				moduleCode
			);

			// Create nested folder structure: targetFolder/courseNftPolicyId/moduleCode
			const moduleFolderPath = `${this.settings.targetFolder}/${courseNftPolicyId}/${moduleCode}`;
			await this.ensureFolderExists(this.settings.targetFolder);
			await this.ensureFolderExists(`${this.settings.targetFolder}/${courseNftPolicyId}`);
			await this.ensureFolderExists(moduleFolderPath);

			// Create module index file
			const indexContent = MarkdownGenerator.generateModuleIndex(moduleData);
			const indexFilename = MarkdownGenerator.generateModuleIndexFilename();
			const indexPath = `${moduleFolderPath}/${indexFilename}`;
			await this.createOrUpdateMarkdownFile(indexPath, indexContent);

			// Create lesson files with numeric names (1-based indexing)
			let createdCount = 0;
			let updatedCount = 0;

			for (let index = 0; index < moduleData.lessons.length; index++) {
				const lesson = moduleData.lessons[index];
				const lessonNumber = index + 1; // 1-based indexing
				const lessonContent = MarkdownGenerator.generateLessonMarkdown(
					lesson,
					moduleData.moduleTitle,
					moduleData.moduleCode
				);
				const lessonFilename = MarkdownGenerator.generateLessonFilename(lessonNumber);
				const lessonPath = `${moduleFolderPath}/${lessonFilename}`;

				const existed = this.app.vault.getAbstractFileByPath(lessonPath) !== null;
				await this.createOrUpdateMarkdownFile(lessonPath, lessonContent);

				if (existed) {
					updatedCount++;
				} else {
					createdCount++;
				}
			}

			new Notice(`Andamio: Fetch completed! Created ${createdCount} files, updated ${updatedCount} files.`);
		} catch (error) {
			console.error('Andamio fetch error:', error);
			new Notice(`Andamio: Fetch failed - ${error.message}`);
		}
	}

	async ensureFolderExists(folderPath: string) {
		const folder = this.app.vault.getAbstractFileByPath(folderPath);
		if (!folder) {
			await this.app.vault.createFolder(folderPath);
		}
	}

	async createOrUpdateMarkdownFile(path: string, content: string) {
		const file = this.app.vault.getAbstractFileByPath(path);

		if (file instanceof TFile) {
			// Update existing file
			await this.app.vault.modify(file, content);
		} else {
			// Create new file
			await this.app.vault.create(path, content);
		}
	}
}

class AndamioSettingTab extends PluginSettingTab {
	plugin: AndamioPlugin;

	constructor(app: App, plugin: AndamioPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('p', {
			text: 'Use the ribbon icon or command palette to fetch content from Andamio.'
		});

		new Setting(containerEl)
			.setName('API Base URL')
			.setDesc('Base URL for Andamio API')
			.addText(text => text
				.setPlaceholder('http://localhost:3000')
				.setValue(this.plugin.settings.apiBaseUrl)
				.onChange(async (value) => {
					this.plugin.settings.apiBaseUrl = value;
					this.plugin.apiClient.setBaseUrl(value);
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Target Folder')
			.setDesc('Folder where Andamio data will be saved')
			.addText(text => text
				.setPlaceholder('Andamio')
				.setValue(this.plugin.settings.targetFolder)
				.onChange(async (value) => {
					this.plugin.settings.targetFolder = value;
					await this.plugin.saveSettings();
				}));
	}
}
