import {
    Box,
    Container,
    Chip,
    IconButton,
    Tooltip,
    Button,
    Divider,
    CircularProgress,
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import EditableTitle from "./EditableTitle";
import SaveStatus from "./SaveStatus";
import type { SaveState } from "./SaveStatus";
import type { Permission } from "../../../api/types/common";

interface DocumentBarProps {
    title: string;
    permission: Permission;
    saveState: SaveState;
    onTitleSave: (newTitle: string) => Promise<void>;
    onManualSave: () => void;
    onOpenHistory: () => void;
    onOpenShare: () => void;
    onExport: () => void;
    isExporting: boolean;
    // Disable export while previewing an old version so we never export the wrong content.
    exportDisabled: boolean;
}

const getPermissionColor = (permission: Permission): "primary" | "info" | "default" => {
    switch (permission) {
        case "OWNER": return "primary";
        case "EDIT": return "info";
        case "VIEW": return "default";
    }
};

const DocumentBar = ({
                         title,
                         permission,
                         saveState,
                         onTitleSave,
                         onManualSave,
                         onOpenHistory,
                         onOpenShare,
                         onExport,
                         isExporting,
                         exportDisabled,
                     }: DocumentBarProps) => {
    const canEdit = permission === "OWNER" || permission === "EDIT";
    const canShare = permission === "OWNER";

    return (
        <Box
            sx={{
                // position: "sticky",
                // top: 60,
                // zIndex: 11,
                backgroundColor: "background.paper",
                borderBottom: "1px solid",
                borderColor: "divider",
            }}
        >
            <Container maxWidth="xl">
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        py: 1,
                        minHeight: 52,
                    }}
                >
                    {/* Title + save status */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            flex: 1,
                            minWidth: 0,
                        }}
                    >
                        <EditableTitle
                            title={title}
                            onSave={onTitleSave}
                            editable={canEdit}
                        />
                        <SaveStatus state={saveState} />
                    </Box>

                    {/* Permission badge */}
                    <Chip
                        label={permission}
                        size="small"
                        color={getPermissionColor(permission)}
                        variant={permission === "VIEW" ? "outlined" : "filled"}
                        sx={{
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            height: 22,
                        }}
                    />

                    <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 1 }} />

                    {/* Actions */}
                    {canEdit && (
                        <Tooltip title="Save (Ctrl+S)">
                            <span>
                                <IconButton
                                    size="small"
                                    onClick={onManualSave}
                                    sx={{
                                        borderRadius: 1,
                                        color: "text.primary",
                                        "&:hover": {
                                            backgroundColor: "rgba(43, 87, 154, 0.08)",
                                            color: "primary.main",
                                        },
                                    }}
                                >
                                    <SaveOutlinedIcon fontSize="small" />
                                </IconButton>
                            </span>
                        </Tooltip>
                    )}

                    <Tooltip title="Version history">
                        <IconButton
                            size="small"
                            onClick={onOpenHistory}
                            sx={{
                                borderRadius: 1,
                                color: "text.primary",
                                "&:hover": {
                                    backgroundColor: "rgba(43, 87, 154, 0.08)",
                                    color: "primary.main",
                                },
                            }}
                        >
                            <HistoryIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={exportDisabled ? "Exit preview to export" : "Export as PDF"}>
                        <span>
                            <IconButton
                                size="small"
                                onClick={onExport}
                                disabled={isExporting || exportDisabled}
                                sx={{
                                    borderRadius: 1,
                                    color: "text.primary",
                                    "&:hover": {
                                        backgroundColor: "rgba(43, 87, 154, 0.08)",
                                        color: "primary.main",
                                    },
                                }}
                            >
                                {isExporting ? (
                                    <CircularProgress size={18} thickness={5} />
                                ) : (
                                    <FileDownloadOutlinedIcon fontSize="small" />
                                )}
                            </IconButton>
                        </span>
                    </Tooltip>

                    {canShare && (
                        <Button
                            variant="contained"
                            startIcon={<ShareOutlinedIcon />}
                            onClick={onOpenShare}
                            size="small"
                            sx={{
                                ml: 0.5,
                                px: 2,
                                py: 0.6,
                                fontSize: "0.85rem",
                                whiteSpace: "nowrap",
                            }}
                        >
                            Share
                        </Button>
                    )}
                </Box>
            </Container>
        </Box>
    );
};

export default DocumentBar;