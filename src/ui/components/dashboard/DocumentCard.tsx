import React, { useState } from "react";
import {
    Card,
    CardActionArea,
    CardContent,
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

interface DocumentCardProps {
    document: DocumentSummaryResponse;
    onOpen: () => void;
    onRename: () => void;
    onDelete: () => void;
    animationDelay?: number;
}

// Format ISO date to "2 hours ago" / "Yesterday" / "Mar 15"
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

const DocumentCard = ({
                          document,
                          onOpen,
                          onRename,
                          onDelete,
                          animationDelay = 0,
                      }: DocumentCardProps) => {
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
        <Card
            sx={{
                position: "relative",
                height: 220,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "none",
                transition: "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
                opacity: 0,
                animation: "cardFadeIn 0.4s ease forwards",
                animationDelay: `${animationDelay}ms`,
                "@keyframes cardFadeIn": {
                    "0%": {
                        opacity: 0,
                        transform: "translateY(8px)",
                    },
                    "100%": {
                        opacity: 1,
                        transform: "translateY(0)",
                    },
                },
                "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0px 8px 24px rgba(43, 87, 154, 0.12)",
                    borderColor: "primary.light",
                    "& .doc-icon-wrapper": {
                        backgroundColor: "rgba(43, 87, 154, 0.12)",
                    },
                },
            }}
        >
            <CardActionArea
                onClick={onOpen}
                sx={{
                    height: "100%",
                    "&:hover .MuiCardActionArea-focusHighlight": {
                        opacity: 0,
                    },
                }}
            >
                <CardContent
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        p: 2.5,
                    }}
                >
                    {/* Top row — icon + 3 dot menu */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 2,
                        }}
                    >
                        <Box
                            className="doc-icon-wrapper"
                            sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 40,
                                height: 40,
                                borderRadius: 2,
                                backgroundColor: "rgba(43, 87, 154, 0.08)",
                                transition: "background-color 0.18s ease",
                            }}
                        >
                            <DescriptionOutlinedIcon
                                sx={{ color: "primary.main", fontSize: 22 }}
                            />
                        </Box>

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
                    </Box>

                    {/* Title */}
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontFamily: "'Merriweather', serif",
                            fontWeight: 700,
                            color: "text.primary",
                            mb: 0.5,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            lineHeight: 1.3,
                            minHeight: "2.6em",
                        }}
                    >
                        {document.title}
                    </Typography>

                    {/* Owner */}
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

                    {/* Spacer pushes badges to bottom */}
                    <Box sx={{ flex: 1 }} />

                    {/* Bottom row — permission badge + date */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mt: 1.5,
                        }}
                    >
                        <Chip
                            label={document.permission}
                            size="small"
                            color={getPermissionColor(document.permission)}
                            variant={document.permission === "VIEW" ? "outlined" : "filled"}
                            sx={{
                                fontSize: "0.7rem",
                                fontWeight: 600,
                                height: 22,
                            }}
                        />
                        <Typography
                            variant="caption"
                            sx={{ color: "text.secondary", fontSize: "0.75rem" }}
                        >
                            {formatRelativeDate(document.updatedAt)}
                        </Typography>
                    </Box>
                </CardContent>
            </CardActionArea>

            {/* 3 dot menu */}
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
        </Card>
    );
};

export default DocumentCard;