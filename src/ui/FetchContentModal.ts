import { App, Modal, Setting } from 'obsidian';

export interface FetchContentResult {
	courseNftPolicyId: string;
	moduleCode: string;
}

export class FetchContentModal extends Modal {
	result: FetchContentResult;
	onSubmit: (result: FetchContentResult) => void;

	constructor(app: App, onSubmit: (result: FetchContentResult) => void) {
		super(app);
		this.onSubmit = onSubmit;
		this.result = {
			courseNftPolicyId: '',
			moduleCode: ''
		};
	}

	onOpen() {
		const { contentEl } = this;

		contentEl.createEl('h2', { text: 'Fetch Andamio Content' });

		new Setting(contentEl)
			.setName('Course NFT Policy ID')
			.setDesc('The NFT policy ID for your course')
			.addText(text => text
				.setPlaceholder('722deb04bb4696b746b5a16aa19e5bb27c30a51e89989513a84ec9ec')
				.setValue(this.result.courseNftPolicyId)
				.onChange(value => {
					this.result.courseNftPolicyId = value;
				}));

		new Setting(contentEl)
			.setName('Module Code')
			.setDesc('The module code to fetch (e.g., "101")')
			.addText(text => text
				.setPlaceholder('101')
				.setValue(this.result.moduleCode)
				.onChange(value => {
					this.result.moduleCode = value;
				}));

		new Setting(contentEl)
			.addButton(btn => btn
				.setButtonText('Cancel')
				.onClick(() => {
					this.close();
				}))
			.addButton(btn => btn
				.setButtonText('Fetch')
				.setCta()
				.onClick(() => {
					this.close();
					this.onSubmit(this.result);
				}));
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
