import { useEffect, useState } from "react";
import { Box, IconButton, Tooltip, Divider, Paper } from "@mui/material";
import type { Editor } from "@tiptap/react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

interface TableFloatingMenuProps {
    editor: Editor | null;
    disabled?: boolean;
}

const TableFloatingMenu = ({ editor, disabled = false }: TableFloatingMenuProps) => {
    const [isInTable, setIsInTable] = useState<boolean>(false);

    useEffect(() => {
        if (!editor) return;

        const updateState = () => {
            setIsInTable(editor.isActive("table"));
        };

        editor.on("selectionUpdate", updateState);
        editor.on("transaction", updateState);

        return () => {
            editor.off("selectionUpdate", updateState);
            editor.off("transaction", updateState);
        };
    }, [editor]);

    if (!editor || !isInTable || disabled) return null;

    const buttonSx = {
        borderRadius: 1,
        color: "white",
        "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.15)",
        },
    };

    const deleteButtonSx = {
        ...buttonSx,
        color: "#FF8A80",
        "&:hover": {
            backgroundColor: "rgba(255, 138, 128, 0.15)",
        },
    };

    return (
        <Paper
            elevation={6}
            sx={{
                position: "fixed",
                bottom: 32,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1200,
                px: 0.7,
                py: 0.5,
                backgroundColor: "#1A1A2E",
                borderRadius: 2,
                boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.30)",
                display: "flex",
                alignItems: "center",
                gap: 0.2,
                animation: "tableMenuEntrance 0.2s ease forwards",
                "@keyframes tableMenuEntrance": {
                    "0%": {
                        opacity: 0,
                        transform: "translateX(-50%) translateY(8px)",
                    },
                    "100%": {
                        opacity: 1,
                        transform: "translateX(-50%) translateY(0)",
                    },
                },
            }}
        >
            <Tooltip title="Add row above">
                <IconButton
                    size="small"
                    onClick={() => editor.chain().focus().addRowBefore().run()}
                    sx={buttonSx}
                >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <KeyboardArrowUpIcon fontSize="small" />
                        <AddIcon sx={{ fontSize: 14, ml: -0.3 }} />
                    </Box>
                </IconButton>
            </Tooltip>
            <Tooltip title="Add row below">
                <IconButton
                    size="small"
                    onClick={() => editor.chain().focus().addRowAfter().run()}
                    sx={buttonSx}
                >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <KeyboardArrowDownIcon fontSize="small" />
                        <AddIcon sx={{ fontSize: 14, ml: -0.3 }} />
                    </Box>
                </IconButton>
            </Tooltip>
            <Tooltip title="Delete row">
                <IconButton
                    size="small"
                    onClick={() => editor.chain().focus().deleteRow().run()}
                    sx={deleteButtonSx}
                >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <KeyboardArrowDownIcon fontSize="small" />
                        <RemoveIcon sx={{ fontSize: 14, ml: -0.3 }} />
                    </Box>
                </IconButton>
            </Tooltip>

            <Divider
                orientation="vertical"
                flexItem
                sx={{ mx: 0.3, my: 0.5, borderColor: "rgba(255, 255, 255, 0.2)" }}
            />

            <Tooltip title="Add column left">
                <IconButton
                    size="small"
                    onClick={() => editor.chain().focus().addColumnBefore().run()}
                    sx={buttonSx}
                >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <KeyboardArrowLeftIcon fontSize="small" />
                        <AddIcon sx={{ fontSize: 14, ml: -0.3 }} />
                    </Box>
                </IconButton>
            </Tooltip>
            <Tooltip title="Add column right">
                <IconButton
                    size="small"
                    onClick={() => editor.chain().focus().addColumnAfter().run()}
                    sx={buttonSx}
                >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <KeyboardArrowRightIcon fontSize="small" />
                        <AddIcon sx={{ fontSize: 14, ml: -0.3 }} />
                    </Box>
                </IconButton>
            </Tooltip>
            <Tooltip title="Delete column">
                <IconButton
                    size="small"
                    onClick={() => editor.chain().focus().deleteColumn().run()}
                    sx={deleteButtonSx}
                >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <KeyboardArrowRightIcon fontSize="small" />
                        <RemoveIcon sx={{ fontSize: 14, ml: -0.3 }} />
                    </Box>
                </IconButton>
            </Tooltip>

            <Divider
                orientation="vertical"
                flexItem
                sx={{ mx: 0.3, my: 0.5, borderColor: "rgba(255, 255, 255, 0.2)" }}
            />

            <Tooltip title="Delete entire table">
                <IconButton
                    size="small"
                    onClick={() => editor.chain().focus().deleteTable().run()}
                    sx={deleteButtonSx}
                >
                    <DeleteOutlineIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        </Paper>
    );
};

export default TableFloatingMenu;