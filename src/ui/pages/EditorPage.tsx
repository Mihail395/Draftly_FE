import { useState, useCallback, useEffect, useRef } from "react";
import { useParams, Navigate } from "react-router-dom";
import {
    Box,
    CircularProgress,
    Paper,
    Button,
    Typography,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import RestoreIcon from "@mui/icons-material/Restore";
import CloseIcon from "@mui/icons-material/Close";
import type { Editor, JSONContent } from "@tiptap/react";

import DocumentBar from "../components/editor/DocumentBar";
import EditorToolbar from "../components/editor/EditorToolbar";
import TipTapEditor from "../components/editor/TipTapEditor";
import EditorSidePanel from "../components/editor/side-panel/EditorSidePanel";
import type { SidePanelTab } from "../components/editor/side-panel/EditorSidePanel";
import type { SaveState } from "../components/editor/SaveStatus";

import useDocument from "../../hooks/useDocument";
import useVersions from "../../hooks/useVersions";
import useCollaborators from "../../hooks/useCollaborators";
import useSnackbar from "../../hooks/useSnackbar";
import useAutoSave from "../../hooks/useAutoSave";
import versionAPI from "../../api/versionAPI";
import { getErrorMessage } from "../../api/utils";
import type { ShareDocumentRequest } from "../../api/types/collaborator";

const EditorPage = () => {
    const { id } = useParams<{ id: string }>();
    const { showSnackbar } = useSnackbar();

    const safeId = id ?? "";
    const { document, isLoading, updateDocument, renameDocument, refetch } = useDocument(safeId);
    const { versions, isRestoring, restoreVersion, refetch: refetchVersions } = useVersions(safeId);
    const { collaborators, addCollaborator, removeCollaborator } = useCollaborators(safeId);

    const [editor, setEditor] = useState<Editor | null>(null);
    const [content, setContent] = useState<JSONContent>({ type: "doc", content: [] });
    const [saveState, setSaveState] = useState<SaveState>("saved");

    const [sidePanelOpen, setSidePanelOpen] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<SidePanelTab>("history");

    const [previewingVersionId, setPreviewingVersionId] = useState<string | null>(null);
    const [previewingVersionInfo, setPreviewingVersionInfo] = useState<{ savedByName: string; createdAt: string } | null>(null);
    const [originalContentBeforePreview, setOriginalContentBeforePreview] = useState<string | null>(null);

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

    // Ref flag to suppress handleEditorUpdate when we're doing programmatic
    // content changes (preview, exit preview, restore). Without this, every
    // programmatic setContent() call would falsely mark the doc as unsaved.
    const suppressUpdateRef = useRef<boolean>(false);

    const canEdit = document?.permission === "OWNER" || document?.permission === "EDIT";
    const canShare = document?.permission === "OWNER";
    const canManage = document?.permission === "OWNER";
    const canRestore = canEdit;
    const isReadOnly = !canEdit || previewingVersionId !== null;

    const handleAutoSave = useCallback(async (newContent: JSONContent) => {
        if (!document || isReadOnly) return;
        setSaveState("saving");
        try {
            await updateDocument({
                title: document.title,
                content: JSON.stringify(newContent),
            });
            setSaveState("saved");
            setHasUnsavedChanges(false);
            void refetchVersions();
        } catch (err) {
            setSaveState("error");
            showSnackbar(getErrorMessage(err, "Failed to auto-save."), "error");
        }
    }, [document, isReadOnly, updateDocument, refetchVersions, showSnackbar]);

    const { saveNow } = useAutoSave({
        data: content,
        onSave: handleAutoSave,
        enabled: !isReadOnly && hasUnsavedChanges,
        delay: 3000,
    });

    const handleManualSave = useCallback(async () => {
        if (!hasUnsavedChanges || isReadOnly) return;
        await saveNow();
    }, [saveNow, isReadOnly, hasUnsavedChanges]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "s") {
                e.preventDefault();
                void handleManualSave();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleManualSave]);

    // Save on tab hide + warn before unload
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
            }
        };

        const handleVisibilityChange = () => {
            if (window.document.visibilityState === "hidden" && hasUnsavedChanges) {
                void saveNow();
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        window.document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [hasUnsavedChanges, saveNow]);

    // Editor content change handler — only fires for REAL user changes
    // Programmatic setContent() calls are filtered out via suppressUpdateRef
    const handleEditorUpdate = useCallback((newContent: JSONContent) => {
        if (suppressUpdateRef.current) {
            return;
        }
        if (isReadOnly) return;
        setContent(newContent);
        setHasUnsavedChanges(true);
        setSaveState("unsaved");
    }, [isReadOnly]);

    const handleTitleSave = useCallback(async (newTitle: string) => {
        try {
            await renameDocument(newTitle);
        } catch (err) {
            showSnackbar(getErrorMessage(err, "Failed to rename document."), "error");
            throw err;
        }
    }, [renameDocument, showSnackbar]);

    const openSidePanelTab = (tab: SidePanelTab) => {
        setActiveTab(tab);
        setSidePanelOpen(true);
    };

    // Helper that wraps editor.commands.setContent in suppression flag
    // so the resulting update event doesn't falsely mark the doc as unsaved
    const setEditorContentSilent = (newContent: JSONContent | string) => {
        if (!editor) return;
        suppressUpdateRef.current = true;
        editor.commands.setContent(newContent);
        setTimeout(() => {
            suppressUpdateRef.current = false;
        }, 0);
    };

    const handlePreviewVersion = async (versionId: string) => {
        if (!editor || !document) return;
        try {
            const version = await versionAPI.getVersionContent(safeId, versionId);
            if (previewingVersionId === null) {
                setOriginalContentBeforePreview(document.content);
            }
            setPreviewingVersionId(versionId);
            setPreviewingVersionInfo({
                savedByName: version.savedByName,
                createdAt: version.createdAt,
            });
            if (version.content) {
                try {
                    setEditorContentSilent(JSON.parse(version.content) as JSONContent);
                } catch {
                    setEditorContentSilent(version.content);
                }
            } else {
                setEditorContentSilent("");
            }
        } catch (err) {
            showSnackbar(getErrorMessage(err, "Failed to load version."), "error");
        }
    };

    const handleExitPreview = () => {
        if (!editor) return;
        if (originalContentBeforePreview) {
            try {
                setEditorContentSilent(JSON.parse(originalContentBeforePreview) as JSONContent);
            } catch {
                setEditorContentSilent(originalContentBeforePreview);
            }
        } else {
            setEditorContentSilent("");
        }
        setPreviewingVersionId(null);
        setPreviewingVersionInfo(null);
        setOriginalContentBeforePreview(null);
    };

    const handleRestoreFromBanner = async () => {
        if (!previewingVersionId) return;
        await handleRestoreVersion(previewingVersionId);
    };

    const handleRestoreVersion = async (versionId: string) => {
        try {
            const restored = await restoreVersion(versionId);
            if (restored && editor) {
                if (restored.content) {
                    try {
                        setEditorContentSilent(JSON.parse(restored.content) as JSONContent);
                    } catch {
                        setEditorContentSilent(restored.content);
                    }
                } else {
                    setEditorContentSilent("");
                }
            }
            setPreviewingVersionId(null);
            setPreviewingVersionInfo(null);
            setOriginalContentBeforePreview(null);
            setHasUnsavedChanges(false);
            setSaveState("saved");
            void refetch();
        } catch (err) {
            showSnackbar(getErrorMessage(err, "Failed to restore version."), "error");
        }
    };

    const handleShare = async (request: ShareDocumentRequest) => {
        await addCollaborator(request);
    };

    const handleRemoveCollaborator = async (email: string) => {
        await removeCollaborator(email);
    };

    const handleExport = () => {
        showSnackbar("PDF export coming soon.", "info");
    };

    const formatPreviewDate = (iso: string): string => {
        const date = new Date(iso);
        return date.toLocaleString(undefined, {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };

    if (!id) {
        return <Navigate to="/dashboard" replace />;
    }

    if (isLoading || !document) {
        return (
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "calc(100vh - 60px)",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: "flex",
                minHeight: "calc(100vh - 60px)",
                backgroundColor: "background.default",
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                    transition: "margin-right 0.25s ease",
                    marginRight: sidePanelOpen ? "380px" : "0px",
                }}
            >
                <DocumentBar
                    title={document.title}
                    permission={document.permission}
                    saveState={saveState}
                    onTitleSave={handleTitleSave}
                    onManualSave={() => void handleManualSave()}
                    onOpenHistory={() => openSidePanelTab("history")}
                    onOpenShare={() => openSidePanelTab("share")}
                    onExport={handleExport}
                />

                {previewingVersionId && previewingVersionInfo && (
                    <Box
                        sx={{
                            position: "sticky",
                            top: 108,
                            zIndex: 9,
                            background: "linear-gradient(90deg, rgba(43, 87, 154, 0.95), rgba(24, 90, 189, 0.95))",
                            color: "white",
                            py: 1.5,
                            px: 3,
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            boxShadow: "0px 4px 12px rgba(43, 87, 154, 0.20)",
                            animation: "bannerEntrance 0.25s ease forwards",
                            "@keyframes bannerEntrance": {
                                "0%": { opacity: 0, transform: "translateY(-8px)" },
                                "100%": { opacity: 1, transform: "translateY(0)" },
                            },
                        }}
                    >
                        <VisibilityOutlinedIcon sx={{ fontSize: 22 }} />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                                You're previewing an older version
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    opacity: 0.9,
                                    fontSize: "0.75rem",
                                    display: "block",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                Saved by {previewingVersionInfo.savedByName} on {formatPreviewDate(previewingVersionInfo.createdAt)}
                            </Typography>
                        </Box>

                        {canRestore && (
                            <Button
                                variant="contained"
                                size="small"
                                startIcon={<RestoreIcon />}
                                onClick={() => void handleRestoreFromBanner()}
                                disabled={isRestoring}
                                sx={{
                                    backgroundColor: "white",
                                    color: "primary.main",
                                    fontWeight: 700,
                                    boxShadow: "none",
                                    "&:hover": {
                                        backgroundColor: "rgba(255, 255, 255, 0.92)",
                                        boxShadow: "none",
                                    },
                                }}
                            >
                                Restore
                            </Button>
                        )}

                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<CloseIcon />}
                            onClick={handleExitPreview}
                            sx={{
                                color: "white",
                                borderColor: "rgba(255, 255, 255, 0.6)",
                                fontWeight: 700,
                                "&:hover": {
                                    borderColor: "white",
                                    backgroundColor: "rgba(255, 255, 255, 0.10)",
                                },
                            }}
                        >
                            Exit preview
                        </Button>
                    </Box>
                )}

                <EditorToolbar editor={editor} disabled={isReadOnly} />

                <Box
                    sx={{
                        flex: 1,
                        py: 4,
                        px: { xs: 2, md: 4 },
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            width: "100%",
                            maxWidth: 880,
                            minHeight: 1000,
                            backgroundColor: "background.paper",
                            borderRadius: 3,
                            boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.06)",
                            py: { xs: 4, md: 7 },
                            px: { xs: 3, md: 9 },
                            border: "1px solid",
                            borderColor: "divider",
                        }}
                    >
                        <TipTapEditor
                            initialContent={document.content}
                            editable={!isReadOnly}
                            onUpdate={handleEditorUpdate}
                            onEditorReady={setEditor}
                        />
                    </Paper>
                </Box>
            </Box>

            <EditorSidePanel
                open={sidePanelOpen}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onClose={() => setSidePanelOpen(false)}
                canRestore={canRestore}
                canManage={canManage}
                canShare={canShare}
                versions={versions}
                versionsLoading={false}
                isRestoring={isRestoring}
                previewingVersionId={previewingVersionId}
                onPreviewVersion={(versionId) => void handlePreviewVersion(versionId)}
                onExitPreview={handleExitPreview}
                onRestoreVersion={handleRestoreVersion}
                collaborators={collaborators}
                collaboratorsLoading={false}
                onRemoveCollaborator={handleRemoveCollaborator}
                onShare={handleShare}
            />
        </Box>
    );
};

export default EditorPage;