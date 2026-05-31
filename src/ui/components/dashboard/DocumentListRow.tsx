import React, { useState } from "react";
import {
    Box,
    Typography,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    Divider,
} from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import type { DocumentSummaryResponse } from "../../../api/types/document";
import type { Permission } from "../../../api/types/common";

interface DocumentListRowProps {
    document: DocumentSummaryResponse;
    onOpen: () => void;
    onRename: () => void;
    onDelete: () => void;
    animationDelay?: number;
}

const formatRelativeDate = (iso: string): string => {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay === 1) return "Yesterday";
    if (diffDay < 7) return `${diffDay}d ago`;
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const getPermissionColor = (permission: Permission): "primary" | "info" | "default" => {
    switch (permission) {
        case "OWNER": return "primary";
        case "EDIT": return "info";
        case "VIEW": return "default";
    }
};

const DocumentListRow = ({
                             document,
                             onOpen,
                             onRename,
                             onDelete,
                             animationDelay = 0,
                         }: DocumentListRowProps) => {
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const menuOpen = Boolean(menuAnchor);

    const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        setMenuAnchor(e.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
    };

    const handleAction = (action: () => void) => (e: React.MouseEvent) => {
        e.stopPropagation();
        setMenuAnchor(null);
        action();
    };

    const canRename = document.permission === "OWNER" || document.permission === "EDIT";
    const canDelete = document.permission === "OWNER";

    return (
        <Box
            onClick={onOpen}
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                px: 2,
                py: 1.5,
                borderRadius: 2,
                cursor: "pointer",
                border: "1px solid transparent",
                transition: "background-color 0.15s ease, border-color 0.15s ease",
                opacity: 0,
                animation: "rowFadeIn 0.3s ease forwards",
                animationDelay: `${animationDelay}ms`,
                "@keyframes rowFadeIn": {
                    "0%": { opacity: 0, transform: "translateY(4px)" },
                    "100%": { opacity: 1, transform: "translateY(0)" },
                },
                "&:hover": {
                    backgroundColor: "rgba(43, 87, 154, 0.04)",
                    borderColor: "rgba(43, 87, 154, 0.15)",
                },
            }}
        >
            {/* Icon */}
            <Box
                sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 36,
                    height: 36,
                    borderRadius: 1.5,
                    backgroundColor: "rgba(43, 87, 154, 0.08)",
                    flexShrink: 0,
                }}
            >
                <DescriptionOutlinedIcon sx={{ color: "primary.main", fontSize: 20 }} />
            </Box>

            {/* Title + owner */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                    variant="body1"
                    sx={{
                        fontFamily: "'Merriweather', serif",
                        fontWeight: 700,
                        color: "text.primary",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {document.title}
                </Typography>
                <Typography
                    variant="caption"
                    sx={{
                        color: "text.secondary",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {document.permission === "OWNER" ? "You" : document.ownerName}
                </Typography>
            </Box>

            {/* Permission badge */}
            <Chip
                label={document.permission}
                size="small"
                color={getPermissionColor(document.permission)}
                variant={document.permission === "VIEW" ? "outlined" : "filled"}
                sx={{
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    height: 22,
                    flexShrink: 0,
                }}
            />

            {/* Date */}
            <Typography
                variant="caption"
                sx={{
                    color: "text.secondary",
                    fontSize: "0.8rem",
                    minWidth: 80,
                    textAlign: "right",
                    flexShrink: 0,
                }}
            >
                {formatRelativeDate(document.updatedAt)}
            </Typography>

            {/* 3 dot menu */}
            <IconButton
                size="small"
                onClick={handleMenuOpen}
                sx={{
                    color: "text.secondary",
                    "&:hover": {
                        backgroundColor: "rgba(43, 87, 154, 0.08)",
                        color: "primary.main",
                    },
                }}
            >
                <MoreVertIcon fontSize="small" />
            </IconButton>

            <Menu
                anchorEl={menuAnchor}
                open={menuOpen}
                onClose={handleMenuClose}
                onClick={(e) => e.stopPropagation()}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
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
                <MenuItem onClick={handleAction(onOpen)} sx={{ gap: 1.5, py: 1 }}>
                    <ListItemIcon>
                        <OpenInNewIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="body2">Open</Typography>
                </MenuItem>

                {canRename && (
                    <MenuItem onClick={handleAction(onRename)} sx={{ gap: 1.5, py: 1 }}>
                        <ListItemIcon>
                            <DriveFileRenameOutlineIcon fontSize="small" />
                        </ListItemIcon>
                        <Typography variant="body2">Rename</Typography>
                    </MenuItem>
                )}

                {canDelete && [
                    <Divider key="divider" />,
                    <MenuItem
                        key="delete"
                        onClick={handleAction(onDelete)}
                        sx={{
                            gap: 1.5,
                            py: 1,
                            color: "error.main",
                            "&:hover": {
                                backgroundColor: "rgba(211, 47, 47, 0.04)",
                            },
                        }}
                    >
                        <ListItemIcon>
                            <DeleteOutlineIcon
                                fontSize="small"
                                sx={{ color: "error.main" }}
                            />
                        </ListItemIcon>
                        <Typography variant="body2">Delete</Typography>
                    </MenuItem>,
                ]}
            </Menu>
        </Box>
    );
};

export default DocumentListRow;