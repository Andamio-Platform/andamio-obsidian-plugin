import { Lesson, AndamioModuleResponse } from '../types/andamio';
import { ContentParser } from './contentParser';

/**
 * Generates markdown content from Andamio lesson data
 */
export class MarkdownGenerator {
	/**
	 * Generate markdown for a single lesson
	 */
	static generateLessonMarkdown(lesson: Lesson, moduleTitle: string, moduleCode: string): string {
		const frontmatter = this.generateFrontmatter(lesson, moduleTitle, moduleCode);
		const content = ContentParser.parseContent(lesson.contentJson);

		return `${frontmatter}\n${content}`;
	}

	/**
	 * Generate YAML frontmatter for a lesson
	 */
	private static generateFrontmatter(lesson: Lesson, moduleTitle: string, moduleCode: string): string {
		// Escape double quotes in YAML values
		const escapeYaml = (str: string) => str.replace(/"/g, '\\"');

		return `---
id: ${lesson.id}
title: "${escapeYaml(lesson.title)}"
module: "${escapeYaml(moduleTitle)}"
moduleCode: "${moduleCode}"
description: "${escapeYaml(lesson.description)}"
---

# ${lesson.title}
`;
	}

	/**
	 * Generate filename for a lesson using its index (1-based)
	 */
	static generateLessonFilename(lessonIndex: number): string {
		return `${lessonIndex}.md`;
	}

	/**
	 * Generate an index file for a module
	 */
	static generateModuleIndex(moduleData: AndamioModuleResponse): string {
		const { moduleTitle, moduleCode, lessons } = moduleData;

		let markdown = `---
moduleTitle: "${moduleTitle}"
moduleCode: "${moduleCode}"
lessonCount: ${lessons.length}
---

# ${moduleTitle}

Module Code: ${moduleCode}

## Lessons

`;

		lessons.forEach((lesson, index) => {
			const lessonNumber = index + 1;
			const filename = this.generateLessonFilename(lessonNumber);
			markdown += `${lessonNumber}. [[${filename.replace('.md', '')}|${lesson.title}]]\n`;
		});

		return markdown;
	}

	/**
	 * Generate filename for module index
	 */
	static generateModuleIndexFilename(): string {
		return `index.md`;
	}
}
