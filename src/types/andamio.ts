// API Response Types

export interface AndamioModuleResponse {
	moduleTitle: string;
	moduleCode: string;
	lessons: Lesson[];
}

export interface Lesson {
	id: string;
	title: string;
	description: string;
	contentJson: ContentDoc;
}

// ProseMirror/TipTap Content Types

export interface ContentDoc {
	type: 'doc';
	content: ContentNode[];
}

export interface ContentNode {
	type: string;
	attrs?: Record<string, any>;
	content?: ContentNode[];
	text?: string;
	marks?: Mark[];
}

export interface Mark {
	type: string;
	attrs?: Record<string, any>;
}

// Supported node types
export type NodeType =
	| 'heading'
	| 'paragraph'
	| 'codeBlock'
	| 'orderedList'
	| 'bulletList'
	| 'listItem'
	| 'imageBlock'
	| 'text';

// Supported mark types
export type MarkType =
	| 'bold'
	| 'italic'
	| 'code'
	| 'link'
	| 'textStyle';
