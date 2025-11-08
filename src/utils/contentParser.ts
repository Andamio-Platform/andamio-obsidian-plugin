import { ContentDoc, ContentNode, Mark } from '../types/andamio';

/**
 * Converts Andamio's ProseMirror/TipTap JSON content to Markdown
 */
export class ContentParser {
	/**
	 * Main entry point - converts a ContentDoc to markdown string
	 */
	static parseContent(doc: ContentDoc): string {
		if (!doc || !doc.content) {
			return '';
		}
		return this.parseNodes(doc.content);
	}

	/**
	 * Parse an array of content nodes
	 */
	private static parseNodes(nodes: ContentNode[]): string {
		return nodes.map(node => this.parseNode(node)).join('');
	}

	/**
	 * Parse a single content node
	 */
	private static parseNode(node: ContentNode, listContext?: { type: 'ordered' | 'bullet', indent: number }): string {
		switch (node.type) {
			case 'heading':
				return this.parseHeading(node);
			case 'paragraph':
				return this.parseParagraph(node, listContext);
			case 'codeBlock':
				return this.parseCodeBlock(node);
			case 'orderedList':
				return this.parseOrderedList(node, listContext?.indent || 0);
			case 'bulletList':
				return this.parseBulletList(node, listContext?.indent || 0);
			case 'listItem':
				return this.parseListItem(node, listContext);
			case 'imageBlock':
				return this.parseImageBlock(node);
			case 'text':
				return this.parseText(node);
			default:
				// For unknown types, try to parse content if it exists
				if (node.content) {
					return this.parseNodes(node.content);
				}
				return '';
		}
	}

	/**
	 * Parse heading node
	 */
	private static parseHeading(node: ContentNode): string {
		const level = node.attrs?.level || 1;
		const headingMarker = '#'.repeat(level);
		const text = node.content ? this.parseNodes(node.content) : '';
		return `${headingMarker} ${text}\n\n`;
	}

	/**
	 * Parse paragraph node
	 */
	private static parseParagraph(node: ContentNode, listContext?: { type: 'ordered' | 'bullet', indent: number }): string {
		const text = node.content ? this.parseNodes(node.content) : '';

		// If in list context, don't add extra newlines
		if (listContext) {
			return text;
		}

		return `${text}\n\n`;
	}

	/**
	 * Parse code block node
	 */
	private static parseCodeBlock(node: ContentNode): string {
		const language = node.attrs?.language || '';
		const code = node.content ? this.parseNodes(node.content) : '';
		return `\`\`\`${language}\n${code}\n\`\`\`\n\n`;
	}

	/**
	 * Parse ordered list node
	 */
	private static parseOrderedList(node: ContentNode, currentIndent: number = 0): string {
		if (!node.content) return '';

		const listContext = { type: 'ordered' as const, indent: currentIndent };
		const items = node.content.map((item, index) => {
			const itemText = this.parseNode(item, listContext);
			const indent = '  '.repeat(currentIndent);
			const startNum = node.attrs?.start || 1;
			return `${indent}${startNum + index}. ${itemText}`;
		}).join('');

		return currentIndent === 0 ? `${items}\n` : items;
	}

	/**
	 * Parse bullet list node
	 */
	private static parseBulletList(node: ContentNode, currentIndent: number = 0): string {
		if (!node.content) return '';

		const listContext = { type: 'bullet' as const, indent: currentIndent };
		const items = node.content.map(item => {
			const itemText = this.parseNode(item, listContext);
			const indent = '  '.repeat(currentIndent);
			return `${indent}- ${itemText}`;
		}).join('');

		return currentIndent === 0 ? `${items}\n` : items;
	}

	/**
	 * Parse list item node
	 */
	private static parseListItem(node: ContentNode, listContext?: { type: 'ordered' | 'bullet', indent: number }): string {
		if (!node.content) return '\n';

		let result = '';
		for (const childNode of node.content) {
			if (childNode.type === 'paragraph') {
				// For paragraph inside list item, parse inline
				result += this.parseNodes(childNode.content || []);
			} else if (childNode.type === 'orderedList' || childNode.type === 'bulletList') {
				// Nested list - increase indent
				const newIndent = (listContext?.indent || 0) + 1;
				result += '\n' + this.parseNode(childNode, { ...listContext!, indent: newIndent });
			} else {
				result += this.parseNode(childNode, listContext);
			}
		}
		return result + '\n';
	}

	/**
	 * Parse image block node
	 */
	private static parseImageBlock(node: ContentNode): string {
		const src = node.attrs?.src || '';
		const alt = node.attrs?.alt || '';
		return `![${alt}](${src})\n\n`;
	}

	/**
	 * Parse text node with marks (bold, italic, links, etc.)
	 */
	private static parseText(node: ContentNode): string {
		let text = node.text || '';

		if (node.marks && node.marks.length > 0) {
			text = this.applyMarks(text, node.marks);
		}

		return text;
	}

	/**
	 * Apply marks (formatting) to text
	 */
	private static applyMarks(text: string, marks: Mark[]): string {
		// Apply marks in reverse order so they nest properly
		// For example: [link, bold] -> **[text](url)**

		let result = text;
		const markStack: Mark[] = [...marks].reverse();

		for (const mark of markStack) {
			switch (mark.type) {
				case 'bold':
					result = `**${result}**`;
					break;
				case 'italic':
					result = `*${result}*`;
					break;
				case 'code':
					result = `\`${result}\``;
					break;
				case 'link':
					const href = mark.attrs?.href || '';
					result = `[${result}](${href})`;
					break;
				case 'textStyle':
					// For now, ignore text styling (colors, etc.) as they don't have markdown equivalents
					// Could use HTML if needed in the future
					break;
			}
		}

		return result;
	}
}
