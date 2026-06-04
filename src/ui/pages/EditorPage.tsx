import { useState, useCallback, useEffect, useRef, useMemo } from "react";
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
import VersionPreview from "../components/editor/VersionPreview";
import EditorSidePanel from "../components/editor/side-panel/EditorSidePanel";
import type { SidePanelTab } from "../components/editor/side-panel/EditorSidePanel";
import type { SaveState } from "../components/editor/SaveStatus";

import useDocument from "../../hooks/useDocument";
import useVersions from "../../hooks/useVersions";
import useCollaborators from "../../hooks/useCollaborators";
import useSnackbar from "../../hooks/useSnackbar";
import useAutoSave from "../../hooks/useAutoSave";
import useAuth from "../../hooks/useAuth";
import useCollaboration from "../../hooks/useCollaboration";
import versionAPI from "../../api/versionAPI";
import { getErrorMessage } from "../../api/utils";
import type { ShareDocumentRequest } from "../../api/types/collaborator";

// Distinct, readable cursor-label colors for live collaboration.
const CURSOR_COLORS = [
    "#2B579A", "#D32F2F", "#388E3C", "#7B1FA2",
    "#F57C00", "#0288D1", "#C2185B", "#00796B",
];

const randomCursorColor = (): string =>
    CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)];

const EditorPage = () => {
    const { id } = useParams<{ id: string }>();
    const { showSnackbar } = useSnackbar();
    const { user } = useAuth();

    const safeId = id ?? "";
    const { document, isLoading, updateDocument, renameDocument } = useDocument(safeId);
    const {
        versions,
        isRestoring,
        restoreVersion,
        refetch: refetchVersions,
        totalPages: versionsTotalPages,
        currentPage: versionsCurrentPage,
        setPage: setVersionsPage,
    } = useVersions(safeId);
    const { collaborators, addCollaborator, removeCollaborator } = useCollaborators(safeId);

    // Live collaboration session (Yjs doc + WebSocket provider) for this document.
    const collab = useCollaboration(safeId);

    // The local user's cursor label — name from auth, random color per session.
    const collabUser = useMemo(() => {
        const name = user
            ? `${user.firstName} ${user.lastName}`.trim() || user.email
            : "Anonymous";
        return { name, color: randomCursorColor() };
    }, [user]);

    const [editor, setEditor] = useState<Editor | null>(null);
    const [content, setContent] = useState<JSONContent>({ type: "doc", content: [] });
    const [saveState, setSaveState] = useState<SaveState>("saved");

    const [sidePanelOpen, setSidePanelOpen] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<SidePanelTab>("history");

    const [previewingVersionId, setPreviewingVersionId] = useState<string | null>(null);
    const [previewingVersionInfo, setPreviewingVersionInfo] = useState<{ savedByName: string; createdAt: string } | null>(null);
    const [previewContent, setPreviewContent] = useState<string | null>(null);

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

    const canEdit = document?.permission === "OWNER" || document?.permission === "EDIT";
    const canShare = document?.permission === "OWNER";
    const canManage = document?.permission === "OWNER";
    const canRestore = canEdit;
    const isPreviewing = previewingVersionId !== null;

    const handleAutoSave = useCallback(async () => {
        if (!document || !canEdit || !editor) return;
        setSaveState("saving");
        // Serialize the live editor (Yjs) state at save time — the source of
        // truth — so concurrent remote edits are persisted, not a stale snapshot.
        try {
            await updateDocument({
                title: document.title,
                content: JSON.stringify(editor.getJSON()),
                contentLength: editor.getText().length,
            });
            setSaveState("saved");
            setHasUnsavedChanges(false);
            void refetchVersions();
        } catch (err) {
            setSaveState("error");
            showSnackbar(getErrorMessage(err, "Failed to auto-save."), "error");
        }
    }, [document, canEdit, editor, updateDocument, refetchVersions, showSnackbar]);

    const { saveNow } = useAutoSave({
        data: content,
        onSave: handleAutoSave,
        enabled: canEdit && hasUnsavedChanges,
        delay: 3000,
    });

    const handleManualSave = useCallback(async () => {
        if (!hasUnsavedChanges || !canEdit) return;
        await saveNow();
    }, [saveNow, canEdit, hasUnsavedChanges]);

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

    // Reset the hydration guard whenever we join a new room (new document).
    const hydratedRef = useRef<boolean>(false);
    useEffect(() => {
        hydratedRef.current = false;
    }, [collab]);

    // Seed the DB content into the Yjs doc only if the room is still empty (we're
    // the first client). An empty "default" fragment reliably means "fresh room"
    // because y-prosemirror doesn't write the default empty paragraph back to Yjs.
    // Gated on the provider's sync so we never seed on top of another client's state.
    useEffect(() => {
        if (!editor || collab.status !== "ready" || !document) return;
        const { ydoc, provider } = collab;

        const hydrate = () => {
            if (hydratedRef.current) return;
            hydratedRef.current = true;

            if (ydoc.getXmlFragment("default").length > 0) return;
            if (!document.content) return;

            // emitUpdate:false → seed the Yjs doc without firing onUpdate, so
            // hydration isn't mistaken for a user edit (no false "unsaved").
            try {
                editor.commands.setContent(JSON.parse(document.content) as JSONContent, { emitUpdate: false });
            } catch {
                editor.commands.setContent(document.content, { emitUpdate: false });
            }
        };

        if (provider.synced) {
            hydrate();
            return;
        }
        const onSync = (isSynced: boolean) => {
            if (isSynced) hydrate();
        };
        provider.on("sync", onSync);
        return () => provider.off("sync", onSync);
    }, [editor, collab, document]);

    // Fires for local edits and for remote edits applied via Yjs — both should
    // mark the doc dirty so this client persists the converged state.
    const handleEditorUpdate = useCallback((newContent: JSONContent) => {
        if (!canEdit) return;
        setContent(newContent);
        setHasUnsavedChanges(true);
        setSaveState("unsaved");
    }, [canEdit]);

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

    // Preview loads the version's content into a separate read-only editor
    // (VersionPreview) — it never touches the live Yjs document.
    const handlePreviewVersion = async (versionId: string) => {
        try {
            const version = await versionAPI.getVersionContent(safeId, versionId);
            setPreviewingVersionId(versionId);
            setPreviewingVersionInfo({
                savedByName: version.savedByName,
                createdAt: version.createdAt,
            });
            setPreviewContent(version.content ?? null);
        } catch (err) {
            showSnackbar(getErrorMessage(err, "Failed to load version."), "error");
        }
    };

    const handleExitPreview = () => {
        setPreviewingVersionId(null);
        setPreviewingVersionInfo(null);
        setPreviewContent(null);
    };

    const handleRestoreFromBanner = async () => {
        if (!previewingVersionId) return;
        await handleRestoreVersion(previewingVersionId);
    };

    // Restore: persist through the existing restore endpoint, then fully reset
    // the live Yjs doc to the restored content. emitUpdate:false keeps THIS
    // client clean (the endpoint already saved it); the reset still broadcasts
    // so other clients converge. A plain page reload can't work here — the
    // no-persistence relay keeps the room in memory, so a reconnect re-syncs to
    // the stale live content instead of the restored DB content.
    const handleRestoreVersion = async (versionId: string) => {
        if (!editor) return;
        const restored = await restoreVersion(versionId);
        if (!restored) return;
        try {
            editor.commands.setContent(
                restored.content ? (JSON.parse(restored.content) as JSONContent) : "",
                { emitUpdate: false },
            );
        } catch {
            editor.commands.setContent(restored.content ?? "", { emitUpdate: false });
        }
        handleExitPreview();
        setHasUnsavedChanges(false);
        setSaveState("saved");
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

    // Auth gate: access check failed or was denied — never open the collab socket.
    if (collab.status === "denied") {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    minHeight: "calc(100vh - 60px)",
                    px: 3,
                    textAlign: "center",
                }}
            >
                <Typography variant="h6" sx={{ fontFamily: "'Merriweather', serif", fontWeight: 700 }}>
                    You don't have access to this document
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", maxWidth: 420 }}>
                    Ask the owner to share it with you, then try again.
                </Typography>
                <Button variant="contained" href="/dashboard">
                    Back to dashboard
                </Button>
            </Box>
        );
    }

    if (isLoading || !document || collab.status !== "ready") {
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

                <EditorToolbar editor={editor} disabled={!canEdit || isPreviewing} />

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
                        {/* Live editor stays mounted (hidden) during preview so the
                            collab session and remote-edit persistence keep running. */}
                        <Box sx={{ display: isPreviewing ? "none" : "block" }}>
                            <TipTapEditor
                                key={safeId}
                                ydoc={collab.ydoc}
                                provider={collab.provider}
                                user={collabUser}
                                editable={canEdit}
                                onUpdate={handleEditorUpdate}
                                onEditorReady={setEditor}
                            />
                        </Box>
                        {isPreviewing && <VersionPreview content={previewContent} />}
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
                versionsTotalPages={versionsTotalPages}
                versionsCurrentPage={versionsCurrentPage}
                onVersionsPageChange={setVersionsPage}
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