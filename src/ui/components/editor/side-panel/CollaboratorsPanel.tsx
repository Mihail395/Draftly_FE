import { useState } from "react";
import {
    Box,
    Typography,
    CircularProgress,
    Avatar,
    Chip,
    IconButton,
    Tooltip,
    Divider,
} from "@mui/material";
import PersonRemoveOutlinedIcon from "@mui/icons-material/PersonRemoveOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import type { CollaboratorResponse } from "../../../../api/types/collaborator";
import type { Permission } from "../../../../api/types/common";

interface CollaboratorsPanelProps {
    collaborators: CollaboratorResponse[];
    isLoading: boolean;
    canManage: boolean;
    onRemove: (email: string) => Promise<void>;
}

const getInitials = (fullName: string): string => {
    const parts = fullName.split(" ").filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
};

const getPermissionColor = (permission: Permission): "primary" | "info" | "default" => {
    switch (permission) {
        case "OWNER": return "primary";
        case "EDIT": return "info";
        case "VIEW": return "default";
    }
};

const CollaboratorsPanel = ({
                                collaborators,
                                isLoading,
                                canManage,
                                onRemove,
                            }: CollaboratorsPanelProps) => {
    const [removingEmail, setRemovingEmail] = useState<string | null>(null);

    const handleRemove = async (email: string) => {
        setRemovingEmail(email);
        try {
            await onRemove(email);
        } finally {
            setRemovingEmail(null);
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress size={28} />
            </Box>
        );
    }

    if (collaborators.length === 0) {
        return (
            <Box sx={{ textAlign: "center", py: 6, px: 3 }}>
                <Box
                    sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        backgroundColor: "rgba(43, 87, 154, 0.08)",
                        mb: 2,
                    }}
                >
                    <GroupOutlinedIcon sx={{ color: "primary.main", fontSize: 28 }} />
                </Box>
                <Typography
                    variant="subtitle1"
                    sx={{
                        fontFamily: "'Merriweather', serif",
                        fontWeight: 700,
                        color: "text.primary",
                    }}
                >
                    No collaborators yet
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            {collaborators.map((collab, idx) => {
                const isOwner = collab.permission === "OWNER";
                const isRemoving = removingEmail === collab.email;

                return (
                    <Box key={collab.email}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                px: 2.5,
                                py: 1.5,
                                transition: "background-color 0.15s ease",
                                "&:hover": {
                                    backgroundColor: "rgba(0, 0, 0, 0.02)",
                                },
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 36,
                                    height: 36,
                                    backgroundColor: "primary.main",
                                    fontSize: "0.8rem",
                                    fontWeight: 700,
                                }}
                            >
                                {getInitials(collab.fullName)}
                            </Avatar>

                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: 600,
                                        color: "text.primary",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {collab.fullName}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: "text.secondary",
                                        fontSize: "0.75rem",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        display: "block",
                                    }}
                                >
                                    {collab.email}
                                </Typography>
                            </Box>

                            <Chip
                                label={collab.permission}
                                size="small"
                                color={getPermissionColor(collab.permission)}
                                variant={collab.permission === "VIEW" ? "outlined" : "filled"}
                                sx={{
                                    fontSize: "0.65rem",
                                    fontWeight: 600,
                                    height: 20,
                                }}
                            />

                            {canManage && !isOwner && (
                                <Tooltip title="Remove collaborator">
                                    <span>
                                        <IconButton
                                            size="small"
                                            onClick={() => void handleRemove(collab.email)}
                                            disabled={isRemoving}
                                            sx={{
                                                color: "text.secondary",
                                                "&:hover": {
                                                    color: "error.main",
                                                    backgroundColor: "rgba(211, 47, 47, 0.06)",
                                                },
                                            }}
                                        >
                                            {isRemoving
                                                ? <CircularProgress size={16} />
                                                : <PersonRemoveOutlinedIcon fontSize="small" />
                                            }
                                        </IconButton>
                                    </span>
                                </Tooltip>
                            )}
                        </Box>

                        {idx < collaborators.length - 1 && <Divider />}
                    </Box>
                );
            })}
        </Box>
    );
};

export default CollaboratorsPanel;