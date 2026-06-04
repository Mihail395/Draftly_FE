import { useEditor, EditorContent } from "@tiptap/react";
import type { JSONContent } from "@tiptap/react";
import { Box } from "@mui/material";
import { buildBaseExtensions } from "./editorExtensions";
import "./Editor.css";

interface VersionPreviewProps {
    content: string | null;
}

const parseContent = (raw: string | null): JSONContent | string => {
    if (!raw) return "";
    try {
        return JSON.parse(raw) as JSONContent;
    } catch {
        return raw;
    }
};

// Read-only render of a saved version's content. Deliberately NOT collaborative:
// it has its own isolated editor with no Yjs binding, so previewing an old
// version never touches the live shared document.
const VersionPreview = ({ content }: VersionPreviewProps) => {
    const editor = useEditor(
        {
            editable: false,
            content: parseContent(content),
            extensions: buildBaseExtensions(),
            editorProps: {
                attributes: { class: "tiptap-content" },
            },
            immediatelyRender: false,
        },
        [content],
    );

    return (
        <Box sx={{ position: "relative" }}>
            <EditorContent editor={editor} className="is-readonly" />
        </Box>
    );
};

export default VersionPreview;
