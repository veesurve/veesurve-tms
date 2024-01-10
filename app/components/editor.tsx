
"use client"; // this registers <Editor> as a Client Component
import { BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";

interface EditorProps {
	onChange: (value: string) => void;
	initialContent?: string;
	editable?: boolean;
}


// Our <Editor> component we can reuse later
export default function Editor({ onChange, initialContent, editable }: EditorProps) {
	// Creates a new editor instance.
	const editor: BlockNoteEditor | null = useBlockNote({});

	// Renders the editor instance using a React component.
	return <BlockNoteView editor={editor} />;
}