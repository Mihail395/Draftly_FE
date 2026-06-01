import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table";
import { TaskList, TaskItem } from "@tiptap/extension-list";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Typography from "@tiptap/extension-typography";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import type { Editor, JSONContent } from "@tiptap/react";
import { Box } from "@mui/material";
import BubbleMenuBar from "./BubbleMenuBar";
import TableFloatingMenu from "./TableFloatingMenu";
import "./Editor.css";

interface TipTapEditorProps {
    initialContent: string | null;
    editable: boolean;
    placeholder?: string;
    onUpdate?: (content: JSONContent) => void;
    onEditorReady?: (editor: Editor) => void;
}

const TipTapEditor = ({
                          initialContent,
                          editable,
                          placeholder = "Start writing…",
                          onUpdate,
                          onEditorReady,
                      }: TipTapEditorProps) => {
    // Parse the JSON string from the backend into TipTap content
    const parseContent = (raw: string | null): JSONContent | string => {
        if (!raw) return "";
        try {
            return JSON.parse(raw) as JSONContent;
        } catch {
            return raw;
        }
    };

    const editor = useEditor({
        editable,
        content: parseContent(initialContent),
        extensions: [
            StarterKit.configure({
                // We add Link, Underline etc. separately for more control
                link: false,
                underline: false,
            }),
            Underline,
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            // Link config fixes:
            // - inclusive: false → typing after a link does NOT extend the link
            // - openOnClick: false → don't open on regular click in edit mode
            // - linkOnPaste: pasting a URL on selected text auto-links it
            // - autolink: typing a URL converts it to a link automatically
            Link.extend({
                inclusive: false,
            }).configure({
                openOnClick: false,
                autolink: true,
                linkOnPaste: true,
                defaultProtocol: "https",
                HTMLAttributes: {
                    rel: "noopener noreferrer",
                    target: "_blank",
                },
            }),
            Image.configure({
                inline: false,
                allowBase64: false,
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            Placeholder.configure({
                placeholder,
            }),
            CharacterCount,
            Typography,
            TextStyle,
            Color,
            Highlight.configure({
                multicolor: true,
            }),
        ],
        editorProps: {
            // Handle Ctrl+Click / Cmd+Click on links to open them in a new tab
            handleClick: (_view, _pos, event) => {
                const target = event.target as HTMLElement;
                const link = target.closest("a");
                if (link && (event.ctrlKey || event.metaKey)) {
                    const href = link.getAttribute("href");
                    if (href) {
                        window.open(href, "_blank", "noopener,noreferrer");
                        event.preventDefault();
                        return true;
                    }
                }
                return false;
            },
            // Tab key handling — always prevent default so focus stays in editor
            // In lists: indent/outdent. Outside lists: insert spaces
            handleKeyDown: (_view, event) => {
                if (event.key === "Tab" && editor) {
                    const isInList =
                        editor.isActive("bulletList") ||
                        editor.isActive("orderedList") ||
                        editor.isActive("taskList");

                    if (isInList) {
                        event.preventDefault();
                        if (event.shiftKey) {
                            editor.chain().focus().liftListItem("listItem").run() ||
                            editor.chain().focus().liftListItem("taskItem").run();
                        } else {
                            editor.chain().focus().sinkListItem("listItem").run() ||
                            editor.chain().focus().sinkListItem("taskItem").run();
                        }
                        return true;
                    }

                    // Not in a list — still prevent default so cursor doesn't leave editor
                    // Insert a couple of spaces for indentation in regular text
                    event.preventDefault();
                    editor.chain().focus().insertContent("  ").run();
                    return true;
                }
                return false;
            },
            attributes: {
                class: "tiptap-content",
            },
        },
        onUpdate: ({ editor }) => {
            if (onUpdate) {
                onUpdate(editor.getJSON());
            }
        },
        immediatelyRender: false,
    });

    // Notify parent when editor is ready
    useEffect(() => {
        if (editor && onEditorReady) {
            onEditorReady(editor);
        }
    }, [editor, onEditorReady]);

    // Update editable state when prop changes
    useEffect(() => {
        if (editor && editor.isEditable !== editable) {
            editor.setEditable(editable);
        }
    }, [editor, editable]);

    return (
        <Box sx={{ position: "relative" }}>
            <BubbleMenuBar editor={editor} />
            <TableFloatingMenu editor={editor} disabled={!editable} />
            <EditorContent
                editor={editor}
                className={!editable ? "is-readonly" : ""}
            />
        </Box>
    );
};

export default TipTapEditor;