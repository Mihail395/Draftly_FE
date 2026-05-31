import { useState, useEffect, useCallback } from "react";
import documentAPI from "../api/documentAPI";
import type { DocumentResponse, UpdateDocumentRequest } from "../api/types/document";
import useSnackbar from "./useSnackbar";

interface UseDocumentReturn {
    document: DocumentResponse | null;
    isLoading: boolean;
    isSaving: boolean;
    updateDocument: (request: UpdateDocumentRequest) => Promise<void>;
    renameDocument: (title: string) => Promise<void>;
    refetch: () => void;
}

const useDocument = (id: string): UseDocumentReturn => {
    const { showSnackbar } = useSnackbar();
    const [document, setDocument] = useState<DocumentResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const fetchDocument = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await documentAPI.getDocumentById(id);
            setDocument(data);
        } catch (err) {
            showSnackbar(
                err instanceof Error ? err.message : "Failed to load document.",
                "error"
            );
        } finally {
            setIsLoading(false);
        }
    }, [id, showSnackbar]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void fetchDocument();
    }, [fetchDocument]);

    const updateDocument = useCallback(async (request: UpdateDocumentRequest) => {
        setIsSaving(true);
        try {
            const updated = await documentAPI.updateDocument(id, request);
            setDocument(updated);
            // No success snackbar — SaveStatus indicator handles this
        } catch (err) {
            showSnackbar(
                err instanceof Error ? err.message : "Failed to save document.",
                "error"
            );
            // Re-throw so the caller (EditorPage) can catch and set its own error state
            throw err;
        } finally {
            setIsSaving(false);
        }
    }, [id, showSnackbar]);

    const renameDocument = useCallback(async (title: string) => {
        try {
            const updated = await documentAPI.renameDocument(id, title);
            setDocument(updated);
            showSnackbar("Document renamed successfully.", "success");
        } catch (err) {
            showSnackbar(
                err instanceof Error ? err.message : "Failed to rename document.",
                "error"
            );
            throw err;
        }
    }, [id, showSnackbar]);

    return {
        document,
        isLoading,
        isSaving,
        updateDocument,
        renameDocument,
        refetch: fetchDocument,
    };
};

export default useDocument;