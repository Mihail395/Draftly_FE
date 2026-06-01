import { useState } from "react";
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Avatar,
    Divider,
    Tooltip,
    Pagination,
} from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import HistoryIcon from "@mui/icons-material/History";
import type { VersionResponse } from "../../../../api/types/version";

interface HistoryPanelProps {
    versions: VersionResponse[];
    isLoading: boolean;
    isRestoring: boolean;
    previewingVersionId: string | null;
    canRestore: boolean;
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    onPreview: (versionId: string) => void;
    onExitPreview: () => void;
    onRestore: (versionId: string) => Promise<void>;
}

// Format ISO date to a nice readable string
// e.g. "Today at 14:23" / "Yesterday at 09:15" / "Mar 15 at 16:42"
const formatDateTime = (iso: string): string => {
    const date = new Date(iso);
    const now = new Date();
    const isSameDay = date.toDateString() === now.toDateString();

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const time = date.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    if (isSameDay) return `Today at ${time}`;
    if (isYesterday) return `Yesterday at ${time}`;
    return `${date.toLocaleDateString(undefined, { month: "short", day: "numeric" })} at ${time}`;
};

const getInitials = (fullName: string): string => {
    const parts = fullName.split(" ").filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
};

const HistoryPanel = ({
                          versions,
                          isLoading,
                          isRestoring,
                          previewingVersionId,
                          canRestore,
                          totalPages,
                          currentPage,
                          onPageChange,
                          onPreview,
                          onExitPreview,
                          onRestore,
                      }: HistoryPanelProps) => {
    const [restoringId, setRestoringId] = useState<string | null>(null);

    const handleRestore = async (versionId: string) => {
        setRestoringId(versionId);
        try {
            await onRestore(versionId);
        } finally {
            setRestoringId(null);
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress size={28} />
            </Box>
        );
    }

    if (versions.length === 0) {
        return (
            <Box
                sx={{
                    textAlign: "center",
                    py: 6,
                    px: 3,
                }}
            >
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
                    <HistoryIcon sx={{ color: "primary.main", fontSize: 28 }} />
                </Box>
                <Typography
                    variant="subtitle1"
                    sx={{
                        fontFamily: "'Merriweather', serif",
                        fontWeight: 700,
                        color: "text.primary",
                        mb: 0.5,
                    }}
                >
                    No versions yet
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Version snapshots are created automatically when you save.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            {/* Preview mode indicator */}
            {previewingVersionId && (
                <Box
                    sx={{
                        px: 2.5,
                        py: 1.5,
                        backgroundColor: "rgba(43, 87, 154, 0.06)",
                        borderBottom: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    <Typography
                        variant="caption"
                        sx={{ color: "primary.main", fontWeight: 600, display: "block", mb: 0.5 }}
                    >
                        Previewing an older version
                    </Typography>
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={onExitPreview}
                        fullWidth
                        sx={{ fontSize: "0.8rem", py: 0.5 }}
                    >
                        Exit preview
                    </Button>
                </Box>
            )}

            {versions.map((version, idx) => {
                const isPreviewing = previewingVersionId === version.id;
                const isRestoringThis = restoringId === version.id && isRestoring;

                return (
                    <Box key={version.id}>
                        <Box
                            sx={{
                                px: 2.5,
                                py: 1.8,
                                backgroundColor: isPreviewing
                                    ? "rgba(43, 87, 154, 0.08)"
                                    : "transparent",
                                borderLeft: "3px solid",
                                borderColor: isPreviewing ? "primary.main" : "transparent",
                                transition: "background-color 0.15s ease, border-color 0.15s ease",
                                "&:hover": {
                                    backgroundColor: isPreviewing
                                        ? "rgba(43, 87, 154, 0.10)"
                                        : "rgba(0, 0, 0, 0.02)",
                                },
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                                <Avatar
                                    sx={{
                                        width: 26,
                                        height: 26,
                                        backgroundColor: "primary.main",
                                        fontSize: "0.65rem",
                                        fontWeight: 700,
                                    }}
                                >
                                    {getInitials(version.savedByName)}
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
                                        {version.savedByName}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{ color: "text.secondary", fontSize: "0.75rem" }}
                                    >
                                        {formatDateTime(version.createdAt)}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: "flex", gap: 1 }}>
                                <Tooltip title={isPreviewing ? "Currently previewing" : "Preview"}>
                                    <span style={{ flex: 1 }}>
                                        <Button
                                            size="small"
                                            variant={isPreviewing ? "contained" : "outlined"}
                                            onClick={() => onPreview(version.id)}
                                            disabled={isPreviewing}
                                            startIcon={<VisibilityOutlinedIcon fontSize="small" />}
                                            sx={{
                                                fontSize: "0.75rem",
                                                py: 0.5,
                                                width: "100%",
                                            }}
                                        >
                                            Preview
                                        </Button>
                                    </span>
                                </Tooltip>

                                {canRestore && (
                                    <Tooltip title="Restore this version">
                                        <span style={{ flex: 1 }}>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="primary"
                                                onClick={() => void handleRestore(version.id)}
                                                disabled={isRestoringThis}
                                                startIcon={
                                                    isRestoringThis
                                                        ? <CircularProgress size={14} color="inherit" />
                                                        : <RestoreIcon fontSize="small" />
                                                }
                                                sx={{
                                                    fontSize: "0.75rem",
                                                    py: 0.5,
                                                    width: "100%",
                                                }}
                                            >
                                                {isRestoringThis ? "Restoring" : "Restore"}
                                            </Button>
                                        </span>
                                    </Tooltip>
                                )}
                            </Box>
                        </Box>

                        {idx < versions.length - 1 && <Divider />}
                    </Box>
                );
            })}

            {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                    <Pagination
                        count={totalPages}
                        page={currentPage + 1}
                        onChange={(_, value) => onPageChange(value - 1)}
                        color="primary"
                        shape="rounded"
                        size="small"
                    />
                </Box>
            )}
        </Box>
    );
};

export default HistoryPanel;