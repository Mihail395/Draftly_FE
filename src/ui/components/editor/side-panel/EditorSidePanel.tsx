import {
    Drawer,
    Box,
    Tabs,
    Tab,
    IconButton,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import HistoryIcon from "@mui/icons-material/History";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import HistoryPanel from "./HistoryPanel";
import CollaboratorsPanel from "./CollaboratorsPanel";
import SharePanel from "./SharePanel";
import type { VersionResponse } from "../../../../api/types/version";
import type { CollaboratorResponse, ShareDocumentRequest } from "../../../../api/types/collaborator";

export type SidePanelTab = "history" | "collaborators" | "share";

interface EditorSidePanelProps {
    open: boolean;
    activeTab: SidePanelTab;
    onTabChange: (tab: SidePanelTab) => void;
    onClose: () => void;

    // Permissions
    canRestore: boolean;
    canManage: boolean;
    canShare: boolean;

    // History
    versions: VersionResponse[];
    versionsLoading: boolean;
    isRestoring: boolean;
    previewingVersionId: string | null;
    versionsTotalPages: number;
    versionsCurrentPage: number;
    onVersionsPageChange: (page: number) => void;
    onPreviewVersion: (versionId: string) => void;
    onExitPreview: () => void;
    onRestoreVersion: (versionId: string) => Promise<void>;

    // Collaborators
    collaborators: CollaboratorResponse[];
    collaboratorsLoading: boolean;
    onRemoveCollaborator: (email: string) => Promise<void>;

    // Share
    onShare: (request: ShareDocumentRequest) => Promise<void>;
}

const EditorSidePanel = ({
                             open,
                             activeTab,
                             onTabChange,
                             onClose,
                             canRestore,
                             canManage,
                             canShare,
                             versions,
                             versionsLoading,
                             isRestoring,
                             previewingVersionId,
                             versionsTotalPages,
                             versionsCurrentPage,
                             onVersionsPageChange,
                             onPreviewVersion,
                             onExitPreview,
                             onRestoreVersion,
                             collaborators,
                             collaboratorsLoading,
                             onRemoveCollaborator,
                             onShare,
                         }: EditorSidePanelProps) => {
    const existingEmails = collaborators.map((c) => c.email);

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            variant="persistent"
            sx={{
                "& .MuiDrawer-paper": {
                    width: 380,
                    borderLeft: "1px solid",
                    borderColor: "divider",
                    backgroundColor: "background.paper",
                    boxSizing: "border-box",
                    top: 60,                       // sit below the AppNavbar
                    height: "calc(100% - 60px)",
                    boxShadow: "-4px 0 16px rgba(0, 0, 0, 0.05)",
                },
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 2.5,
                    py: 1.5,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Typography
                    variant="subtitle1"
                    sx={{
                        fontFamily: "'Merriweather', serif",
                        fontWeight: 700,
                        color: "text.primary",
                    }}
                >
                    Document
                </Typography>
                <IconButton size="small" onClick={onClose}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>

            {/* Tabs */}
            <Tabs
                value={activeTab}
                onChange={(_, value: SidePanelTab) => onTabChange(value)}
                variant="fullWidth"
                sx={{
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    minHeight: 44,
                    "& .MuiTab-root": {
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: "0.82rem",
                        minHeight: 44,
                        py: 1,
                        gap: 0.7,
                        flexDirection: "row",
                        color: "text.secondary",
                        "&.Mui-selected": {
                            color: "primary.main",
                        },
                    },
                    "& .MuiTabs-indicator": {
                        height: 2.5,
                        borderRadius: "3px 3px 0 0",
                    },
                }}
            >
                <Tab
                    value="history"
                    icon={<HistoryIcon fontSize="small" />}
                    iconPosition="start"
                    label="History"
                />
                <Tab
                    value="collaborators"
                    icon={<GroupOutlinedIcon fontSize="small" />}
                    iconPosition="start"
                    label="People"
                />
                {canShare && (
                    <Tab
                        value="share"
                        icon={<PersonAddOutlinedIcon fontSize="small" />}
                        iconPosition="start"
                        label="Share"
                    />
                )}
            </Tabs>

            {/* Panel content */}
            <Box sx={{ flex: 1, overflowY: "auto" }}>
                {activeTab === "history" && (
                    <HistoryPanel
                        versions={versions}
                        isLoading={versionsLoading}
                        isRestoring={isRestoring}
                        previewingVersionId={previewingVersionId}
                        canRestore={canRestore}
                        totalPages={versionsTotalPages}
                        currentPage={versionsCurrentPage}
                        onPageChange={onVersionsPageChange}
                        onPreview={onPreviewVersion}
                        onExitPreview={onExitPreview}
                        onRestore={onRestoreVersion}
                    />
                )}

                {activeTab === "collaborators" && (
                    <CollaboratorsPanel
                        collaborators={collaborators}
                        isLoading={collaboratorsLoading}
                        canManage={canManage}
                        onRemove={onRemoveCollaborator}
                    />
                )}

                {activeTab === "share" && canShare && (
                    <SharePanel
                        existingCollaboratorEmails={existingEmails}
                        onShare={onShare}
                    />
                )}
            </Box>
        </Drawer>
    );
};

export default EditorSidePanel;