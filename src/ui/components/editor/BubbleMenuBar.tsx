import { useState } from "react";
import { Box, IconButton, Tooltip, Divider } from "@mui/material";
import { BubbleMenu } from "@tiptap/react/menus";
import type { Editor } from "@tiptap/react";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import LinkIcon from "@mui/icons-material/Link";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import CodeIcon from "@mui/icons-material/Code";
import LinkDialog from "./LinkDialog";

interface BubbleMenuBarProps {
    editor: Editor | null;
}

const BubbleMenuBar = ({ editor }: BubbleMenuBarProps) => {
    const [linkDialogOpen, setLinkDialogOpen] = useState<boolean>(false);

    if (!editor) return null;

    const isActive = (name: string): boolean => editor.isActive(name);

    const handleInsertLink = (url: string) => {
        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
        setLinkDialogOpen(false);
    };

    const handleRemoveLink = () => {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
    };

    const buttonSx = {
        borderRadius: 1,
        color: "white",
        "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.15)",
        },
    };

    const activeButtonSx = {
        ...buttonSx,
        backgroundColor: "rgba(255, 255, 255, 0.20)",
    };

    const dangerButtonSx = {
        ...buttonSx,
        color: "#FF8A80",
        "&:hover": {
            backgroundColor: "rgba(255, 138, 128, 0.15)",
        },
    };

    const linkActive = isActive("link");

    return (
        <>
            <BubbleMenu
                editor={editor}
                options={{
                    placement: "top",
                    offset: 8,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.2,
                        px: 0.7,
                        py: 0.5,
                        backgroundColor: "#1A1A2E",
                        borderRadius: 2,
                        boxShadow: "0px 6px 24px rgba(0, 0, 0, 0.25)",
                        animation: "bubbleEntrance 0.15s ease forwards",
                        "@keyframes bubbleEntrance": {
                            "0%": {
                                opacity: 0,
                                transform: "translateY(4px) scale(0.96)",
                            },
                            "100%": {
                                opacity: 1,
                                transform: "translateY(0) scale(1)",
                            },
                        },
                    }}
                >
                    <Tooltip title="Bold">
                        <IconButton
                            size="small"
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            sx={isActive("bold") ? activeButtonSx : buttonSx}
                        >
                            <FormatBoldIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Italic">
                        <IconButton
                            size="small"
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            sx={isActive("italic") ? activeButtonSx : buttonSx}
                        >
                            <FormatItalicIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Underline">
                        <IconButton
                            size="small"
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                            sx={isActive("underline") ? activeButtonSx : buttonSx}
                        >
                            <FormatUnderlinedIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Strikethrough">
                        <IconButton
                            size="small"
                            onClick={() => editor.chain().focus().toggleStrike().run()}
                            sx={isActive("strike") ? activeButtonSx : buttonSx}
                        >
                            <StrikethroughSIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Code">
                        <IconButton
                            size="small"
                            onClick={() => editor.chain().focus().toggleCode().run()}
                            sx={isActive("code") ? activeButtonSx : buttonSx}
                        >
                            <CodeIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Divider
                        orientation="vertical"
                        flexItem
                        sx={{ mx: 0.3, my: 0.5, borderColor: "rgba(255, 255, 255, 0.2)" }}
                    />

                    <Tooltip title={linkActive ? "Edit link" : "Insert link"}>
                        <IconButton
                            size="small"
                            onClick={() => setLinkDialogOpen(true)}
                            sx={linkActive ? activeButtonSx : buttonSx}
                        >
                            <LinkIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    {linkActive && (
                        <Tooltip title="Remove link">
                            <IconButton
                                size="small"
                                onClick={handleRemoveLink}
                                sx={dangerButtonSx}
                            >
                                <LinkOffIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
            </BubbleMenu>

            <LinkDialog
                key={`bubble-link-${linkDialogOpen}`}
                open={linkDialogOpen}
                initialUrl={editor.getAttributes("link").href ?? ""}
                onClose={() => setLinkDialogOpen(false)}
                onConfirm={handleInsertLink}
            />
        </>
    );
};

export default BubbleMenuBar;