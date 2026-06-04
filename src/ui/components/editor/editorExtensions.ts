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
import type { Extensions } from "@tiptap/react";

// Shared editor extension set — everything except the real-time collaboration
// extensions (Collaboration/CollaborationCaret), which only the live editor
// adds. The read-only version preview reuses this so it renders identically.
// `undoRedo` stays disabled: the live editor delegates history to Yjs, and the
// preview is read-only so it never needs undo.
export const buildBaseExtensions = (placeholder = "Start writing…"): Extensions => [
    StarterKit.configure({
        link: false,
        underline: false,
        undoRedo: false,
    }),
    Underline,
    TextAlign.configure({
        types: ["heading", "paragraph"],
    }),
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
];
