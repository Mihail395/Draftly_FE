import { useState, useMemo } from "react";
import { Box, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardToolbar from "../components/dashboard/DashboardToolbar";
import type { ViewMode } from "../components/dashboard/DashboardToolbar";
import DocumentGrid from "../components/dashboard/DocumentGrid";
import DocumentList from "../components/dashboard/DocumentList";
import EmptyState from "../components/dashboard/EmptyState";
import NewDocumentDialog from "../components/dashboard/NewDocumentDialog";
import RenameDialog from "../components/dashboard/RenameDialog";
import DeleteConfirmDialog from "../components/dashboard/DeleteConfirmDialog";
import useDocuments from "../../hooks/useDocuments";
import useDebounce from "../../hooks/useDebounce";
import useSnackbar from "../../hooks/useSnackbar";
import documentAPI from "../../api/documentAPI";
import { getErrorMessage } from "../../api/utils";
import type { DocumentFilter, SortField } from "../../api/types/common";
import type { DocumentSummaryResponse } from "../../api/types/document";

const DashboardPage = () => {
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    // Toolbar state
    const [searchInput, setSearchInput] = useState<string>("");
    const [filter, setFilter] = useState<DocumentFilter>("ALL");
    const [sort, setSort] = useState<SortField>("UPDATED_AT");
    const [viewMode, setViewMode] = useState<ViewMode>("grid");

    // Debounce the search input — only triggers filtering after 300ms idle
    const debouncedSearch = useDebounce(searchInput, 300);

    // Fetch documents based on filter + sort
    const { documents, isLoading, refetch } = useDocuments(filter, sort);

    // Dialog state
    const [newDocOpen, setNewDocOpen] = useState<boolean>(false);
    const [renameTarget, setRenameTarget] = useState<DocumentSummaryResponse | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<DocumentSummaryResponse | null>(null);

    // Client-side filtering by title for the search bar
    // Backend already filtered by permission/filter, search is small enough
    // to do client-side without an extra API call
    const filteredDocuments = useMemo(() => {
        if (!debouncedSearch.trim()) return documents;
        const q = debouncedSearch.toLowerCase();
        return documents.filter((d) => d.title.toLowerCase().includes(q));
    }, [documents, debouncedSearch]);

    const handleOpen = (id: string) => {
        navigate(`/documents/${id}`);
    };

    const handleCreateDocument = async (title: string) => {
        try {
            const newDoc = await documentAPI.createDocument({ title });
            setNewDocOpen(false);
            showSnackbar("Document created.", "success");
            navigate(`/documents/${newDoc.id}`);
        } catch (err) {
            showSnackbar(getErrorMessage(err, "Failed to create document."), "error");
            throw err; // re-throw so dialog stops its loading state
        }
    };

    const handleRenameDocument = async (newTitle: string) => {
        if (!renameTarget) return;
        try {
            await documentAPI.renameDocument(renameTarget.id, newTitle);
            setRenameTarget(null);
            showSnackbar("Document renamed.", "success");
            void refetch();
        } catch (err) {
            showSnackbar(getErrorMessage(err, "Failed to rename document."), "error");
            throw err;
        }
    };

    const handleDeleteDocument = async () => {
        if (!deleteTarget) return;
        try {
            await documentAPI.deleteDocument(deleteTarget.id);
            setDeleteTarget(null);
            showSnackbar("Document deleted.", "success");
            void refetch();
        } catch (err) {
            showSnackbar(getErrorMessage(err, "Failed to delete document."), "error");
            throw err;
        }
    };

    // Filter labels for empty state messaging
    const filterLabel =
        filter === "OWNED" ? "Owned by me"
            : filter === "SHARED" ? "Shared with me"
                : "All";

    const showEmptyState = !isLoading && filteredDocuments.length === 0;

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <DashboardHeader onNewDocument={() => setNewDocOpen(true)} />

            <DashboardToolbar
                searchQuery={searchInput}
                onSearchChange={setSearchInput}
                filter={filter}
                onFilterChange={setFilter}
                sort={sort}
                onSortChange={setSort}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
            />

            {/* Documents area */}
            {showEmptyState ? (
                <EmptyState
                    onCreateClick={() => setNewDocOpen(true)}
                    searchQuery={debouncedSearch}
                    filterLabel={filterLabel}
                />
            ) : (
                <Box>
                    {viewMode === "grid" ? (
                        <DocumentGrid
                            documents={filteredDocuments}
                            isLoading={isLoading}
                            onOpen={handleOpen}
                            onRename={(doc) => setRenameTarget(doc)}
                            onDelete={(doc) => setDeleteTarget(doc)}
                        />
                    ) : (
                        <DocumentList
                            documents={filteredDocuments}
                            isLoading={isLoading}
                            onOpen={handleOpen}
                            onRename={(doc) => setRenameTarget(doc)}
                            onDelete={(doc) => setDeleteTarget(doc)}
                        />
                    )}
                </Box>
            )}

            {/* Dialogs — keyed to force fresh mount each open */}
            <NewDocumentDialog
                key={`new-${newDocOpen}`}
                open={newDocOpen}
                onClose={() => setNewDocOpen(false)}
                onConfirm={handleCreateDocument}
            />

            <RenameDialog
                key={`rename-${renameTarget?.id ?? "none"}`}
                open={!!renameTarget}
                currentTitle={renameTarget?.title ?? ""}
                onClose={() => setRenameTarget(null)}
                onConfirm={handleRenameDocument}
            />

            <DeleteConfirmDialog
                key={`delete-${deleteTarget?.id ?? "none"}`}
                open={!!deleteTarget}
                documentTitle={deleteTarget?.title ?? ""}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDeleteDocument}
            />
        </Container>
    );
};

export default DashboardPage;