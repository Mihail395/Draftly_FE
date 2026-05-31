import { useState } from "react";
import {
    Box,
    IconButton,
    Tooltip,
    Divider,
    Menu,
    MenuItem,
    Typography,
} from "@mui/material";
import type { Editor } from "@tiptap/react";

// Icons
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import CodeIcon from "@mui/icons-material/Code";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import ChecklistIcon from "@mui/icons-material/Checklist";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import LinkIcon from "@mui/icons-material/Link";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import TitleIcon from "@mui/icons-material/Title";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import ColorPickerButton from "./ColorPickerButton";
import LinkDialog from "./LinkDialog";
import ImageUploadDialog from "./ImageUploadDialog";

interface EditorToolbarProps {
    editor: Editor | null;
    disabled?: boolean;
}

const EditorToolbar = ({ editor, disabled = false }: EditorToolbarProps) => {
    const [headingMenuAnchor, setHeadingMenuAnchor] = useState<null | HTMLElement>(null);
    const [linkDialogOpen, setLinkDialogOpen] = useState<boolean>(false);
    const [imageDialogOpen, setImageDialogOpen] = useState<boolean>(false);

    if (!editor) return null;

    const isActive = (name: string, attrs?: Record<string, unknown>): boolean => {
        if (disabled) return false;
        return attrs ? editor.isActive(name, attrs) : editor.isActive(name);
    };

    // Get current heading level for dropdown label
    const getCurrentHeading = (): string => {
        if (editor.isActive("heading", { level: 1 })) return "Heading 1";
        if (editor.isActive("heading", { level: 2 })) return "Heading 2";
        if (editor.isActive("heading", { level: 3 })) return "Heading 3";
        return "Paragraph";
    };

    const handleHeadingSelect = (level: 1 | 2 | 3 | null) => {
        if (level === null) {
            editor.chain().focus().setParagraph().run();
        } else {
            editor.chain().focus().toggleHeading({ level }).run();
        }
        setHeadingMenuAnchor(null);
    };

    const handleInsertLink = (url: string) => {
        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
        setLinkDialogOpen(false);
    };

    const handleInsertImage = (url: string) => {
        editor.chain().focus().setImage({ src: url }).run();
        setImageDialogOpen(false);
    };

    const handleInsertTable = () => {
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    };

    const handleTextColor = (color: string | null) => {
        if (color === null) {
            editor.chain().focus().unsetColor().run();
        } else {
            editor.chain().focus().setColor(color).run();
        }
    };

    const handleHighlight = (color: string | null) => {
        if (color === null) {
            editor.chain().focus().unsetHighlight().run();
        } else {
            editor.chain().focus().toggleHighlight({ color }).run();
        }
    };

    const buttonSx = {
        borderRadius: 1,
        color: "text.primary",
        "&:hover": {
            backgroundColor: "rgba(43, 87, 154, 0.08)",
        },
        "&.Mui-disabled": {
            opacity: 0.4,
        },
    };

    const activeButtonSx = {
        ...buttonSx,
        backgroundColor: "rgba(43, 87, 154, 0.12)",
        color: "primary.main",
        "&:hover": {
            backgroundColor: "rgba(43, 87, 154, 0.18)",
        },
    };

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.3,
                    flexWrap: "wrap",
                    px: 1.5,
                    py: 0.7,
                    backgroundColor: "background.paper",
                    borderTop: "1px solid",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    position: "sticky",
                    top: 60,
                    zIndex: 10,
                }}
            >
                {/* Heading dropdown */}
                <Tooltip title="Text style">
                    <span>
                        <Box
                            onClick={(e) =>
                                !disabled && setHeadingMenuAnchor(e.currentTarget)
                            }
                            sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 0.3,
                                px: 1,
                                py: 0.6,
                                borderRadius: 1,
                                cursor: disabled ? "not-allowed" : "pointer",
                                opacity: disabled ? 0.4 : 1,
                                minWidth: 130,
                                "&:hover": disabled
                                    ? {}
                                    : { backgroundColor: "rgba(43, 87, 154, 0.08)" },
                            }}
                        >
                            <TitleIcon fontSize="small" sx={{ color: "text.secondary" }} />
                            <Typography
                                variant="body2"
                                sx={{ flex: 1, fontSize: "0.85rem", fontWeight: 500 }}
                            >
                                {getCurrentHeading()}
                            </Typography>
                            <KeyboardArrowDownIcon
                                fontSize="small"
                                sx={{ color: "text.secondary" }}
                            />
                        </Box>
                    </span>
                </Tooltip>
                <Menu
                    anchorEl={headingMenuAnchor}
                    open={Boolean(headingMenuAnchor)}
                    onClose={() => setHeadingMenuAnchor(null)}
                    slotProps={{
                        paper: {
                            elevation: 0,
                            sx: {
                                mt: 0.5,
                                minWidth: 180,
                                border: "1px solid",
                                borderColor: "divider",
                                boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.08)",
                                borderRadius: 2,
                            },
                        },
                    }}
                >
                    <MenuItem onClick={() => handleHeadingSelect(null)}>
                        <Typography variant="body2">Paragraph</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => handleHeadingSelect(1)}>
                        <Typography
                            sx={{
                                fontFamily: "'Merriweather', serif",
                                fontWeight: 700,
                                fontSize: "1.3rem",
                            }}
                        >
                            Heading 1
                        </Typography>
                    </MenuItem>
                    <MenuItem onClick={() => handleHeadingSelect(2)}>
                        <Typography
                            sx={{
                                fontFamily: "'Merriweather', serif",
                                fontWeight: 700,
                                fontSize: "1.15rem",
                            }}
                        >
                            Heading 2
                        </Typography>
                    </MenuItem>
                    <MenuItem onClick={() => handleHeadingSelect(3)}>
                        <Typography
                            sx={{
                                fontFamily: "'Merriweather', serif",
                                fontWeight: 600,
                                fontSize: "1rem",
                            }}
                        >
                            Heading 3
                        </Typography>
                    </MenuItem>
                </Menu>

                <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5 }} />

                {/* Bold, Italic, Underline, Strike, Code */}
                <Tooltip title="Bold (Ctrl+B)">
                    <span>
                        <IconButton
                            size="small"
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            disabled={disabled}
                            sx={isActive("bold") ? activeButtonSx : buttonSx}
                        >
                            <FormatBoldIcon fontSize="small" />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="Italic (Ctrl+I)">
                    <span>
                        <IconButton
                            size="small"
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            disabled={disabled}
                            sx={isActive("italic") ? activeButtonSx : buttonSx}
                        >
                            <FormatItalicIcon fontSize="small" />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="Underline (Ctrl+U)">
                    <span>
                        <IconButton
                            size="small"
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                            disabled={disabled}
                            sx={isActive("underline") ? activeButtonSx : buttonSx}
                        >
                            <FormatUnderlinedIcon fontSize="small" />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="Strikethrough">
                    <span>
                        <IconButton
                            size="small"
                            onClick={() => editor.chain().focus().toggleStrike().run()}
                            disabled={disabled}
                            sx={isActive("strike") ? activeButtonSx : buttonSx}
                        >
                            <StrikethroughSIcon fontSize="small" />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="Inline code">
                    <span>
                        <IconButton
                            size="small"
                            onClick={() => editor.chain().focus().toggleCode().run()}
                            disabled={disabled}
                            sx={isActive("code") ? activeButtonSx : buttonSx}
                        >
                            <CodeIcon fontSize="small" />
                        </IconButton>
                    </span>
                </Tooltip>

                <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5 }} />

                {/* Color + Highlight */}
                <ColorPickerButton
                    mode="text"
                    currentColor={editor.getAttributes("textStyle").color}
                    onColorChange={handleTextColor}
                    disabled={disabled}
                />
                <ColorPickerButton
                    mode="highlight"
                    currentColor={editor.getAttributes("highlight").color}
                    onColorChange={handleHighlight}
                    disabled={disabled}
                />

                <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5 }} />

                {/* Lists */}
                <Tooltip title="Bullet list">
                    <span>
                        <IconButton
                            size="small"
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            disabled={disabled}
                            sx={isActive("bulletList") ? activeButtonSx : buttonSx}
                        >
                            <FormatListBulletedIcon fontSize="small" />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="Numbered list">
                    <span>
                        <IconButton
                            size="small"
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            disabled={disabled}
                            sx={isActive("orderedList") ? activeButtonSx : buttonSx}
                        >
                            <FormatListNumberedIcon fontSize="small" />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="Task list">
                    <span>
                        <IconButton
                            size="small"
                            onClick={() => editor.chain().focus().toggleTaskList().run()}
                            disabled={disabled}
                            sx={isActive("taskList") ? activeButtonSx : buttonSx}
                        >
                            <ChecklistIcon fontSize="small" />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="Quote">
                    <span>
                        <IconButton
                            size="small"
                            onClick={() => editor.chain().focus().toggleBlockquote().run()}
                            disabled={disabled}
                            sx={isActive("blockquote") ? activeButtonSx : buttonSx}
                        >
                            <FormatQuoteIcon fontSize="small" />
                        </IconButton>
                    </span>
                </Tooltip>

                <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5 }} />

                {/* Alignment */}
                <Tooltip title="Align left">
                    <span>
                        <IconButton
                            size="small"
                            onClick={() => editor.chain().focus().setTextAlign("left").run()}
                            disabled={disabled}
                            sx={isActive("paragraph", { textAlign: "left" }) ? activeButtonSx : buttonSx}
                        >
                            <FormatAlignLeftIcon fontSize="small" />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="Align center">
                    <span>
                        <IconButton
                            size="small"
                            onClick={() => editor.chain().focus().setTextAlign("center").run()}
                            disabled={disabled}
                            sx={isActive("paragraph", { textAlign: "center" }) ? activeButtonSx : buttonSx}
                        >
                            <FormatAlignCenterIcon fontSize="small" />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="Align right">
                    <span>
                        <IconButton
                            size="small"
                            onClick={() => editor.chain().focus().setTextAlign("right").run()}
                            disabled={disabled}
                            sx={isActive("paragraph", { textAlign: "right" }) ? activeButtonSx : buttonSx}
                        >
                            <FormatAlignRightIcon fontSize="small" />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="Justify">
                    <span>
                        <IconButton
                            size="small"
                            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
                            disabled={disabled}
                            sx={isActive("paragraph", { textAlign: "justify" }) ? activeButtonSx : buttonSx}
                        >
                            <FormatAlignJustifyIcon fontSize="small" />
                        </IconButton>
                    </span>
                </Tooltip>

                <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5 }} />

                {/* Insert link, image, table, hr */}
                <Tooltip title="Insert link">
                    <span>
                        <IconButton
                            size="small"
                            onClick={() => setLinkDialogOpen(true)}
                            disabled={disabled}
                            sx={isActive("link") ? activeButtonSx : buttonSx}
                        >
                            <LinkIcon fontSize="small" />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="Insert image">
                    <span>
                        <IconButton
                            size="small"
                            onClick={() => setImageDialogOpen(true)}
                            disabled={disabled}
                            sx={buttonSx}
                        >
                            <ImageOutlinedIcon fontSize="small" />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="Insert table">
                    <span>
                        <IconButton
                            size="small"
                            onClick={handleInsertTable}
                            disabled={disabled}
                            sx={buttonSx}
                        >
                            <TableChartOutlinedIcon fontSize="small" />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="Horizontal rule">
                    <span>
                        <IconButton
                            size="small"
                            onClick={() => editor.chain().focus().setHorizontalRule().run()}
                            disabled={disabled}
                            sx={buttonSx}
                        >
                            <HorizontalRuleIcon fontSize="small" />
                        </IconButton>
                    </span>
                </Tooltip>

                <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5 }} />

                {/* Undo / Redo */}
                <Tooltip title="Undo (Ctrl+Z)">
                    <span>
                        <IconButton
                            size="small"
                            onClick={() => editor.chain().focus().undo().run()}
                            disabled={disabled || !editor.can().undo()}
                            sx={buttonSx}
                        >
                            <UndoIcon fontSize="small" />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="Redo (Ctrl+Y)">
                    <span>
                        <IconButton
                            size="small"
                            onClick={() => editor.chain().focus().redo().run()}
                            disabled={disabled || !editor.can().redo()}
                            sx={buttonSx}
                        >
                            <RedoIcon fontSize="small" />
                        </IconButton>
                    </span>
                </Tooltip>
            </Box>

            <LinkDialog
                key={`link-${linkDialogOpen}`}
                open={linkDialogOpen}
                initialUrl={editor.getAttributes("link").href ?? ""}
                onClose={() => setLinkDialogOpen(false)}
                onConfirm={handleInsertLink}
            />

            <ImageUploadDialog
                key={`image-${imageDialogOpen}`}
                open={imageDialogOpen}
                onClose={() => setImageDialogOpen(false)}
                onConfirm={handleInsertImage}
            />
        </>
    );
};

export default EditorToolbar;