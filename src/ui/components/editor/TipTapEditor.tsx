import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import type { Editor, JSONContent } from "@tiptap/react";
import type * as Y from "yjs";
import type { WebsocketProvider } from "y-websocket";
import { Box } from "@mui/material";
import BubbleMenuBar from "./BubbleMenuBar";
import TableFloatingMenu from "./TableFloatingMenu";
import { buildBaseExtensions } from "./editorExtensions";
import "./Editor.css";

interface TipTapEditorProps {
    // Yjs document + provider that own the live, collaborative content.
    // Content is NOT seeded via the `content` option (that would duplicate it
    // across clients) — it lives in the shared Yjs doc.
    ydoc: Y.Doc;
    provider: WebsocketProvider;
    // Cursor label for the local user (live cursors of remote users).
    user: { name: string; color: string };
    editable: boolean;
    placeholder?: string;
    onUpdate?: (content: JSONContent) => void;
    onEditorReady?: (editor: Editor) => void;
}

const TipTapEditor = ({
                          ydoc,
                          provider,
                          user,
                          editable,
                          placeholder = "Start writing…",
                          onUpdate,
                          onEditorReady,
                      }: TipTapEditorProps) => {
    const editor = useEditor({
        editable,
        // No `content` here: the Collaboration extension owns the document
        // content via the Yjs doc. Seeding `content` per client would
        // duplicate text once multiple clients join the same room.
        extensions: [
            ...buildBaseExtensions(placeholder),
            // Bind the editor to the shared Yjs doc and render remote users'
            // live cursors via the provider awareness.
            Collaboration.configure({
                document: ydoc,
            }),
            CollaborationCaret.configure({
                provider,
                user,
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