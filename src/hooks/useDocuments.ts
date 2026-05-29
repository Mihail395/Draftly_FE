import { useState, useEffect, useCallback } from "react";
import documentAPI from "../api/documentAPI";
import type { DocumentSummaryResponse } from "../api/types/document";
import type { DocumentFilter, SortField } from "../api/types/common";
import useSnackbar from "./useSnackbar";

interface UseDocumentsReturn {
    documents: DocumentSummaryResponse[];
    isLoading: boolean;
    refetch: () => void;
}

const useDocuments = (
    filter: DocumentFilter = "ALL",
    sort: SortField = "UPDATED_AT"
): UseDocumentsReturn => {
    const {showSnackbar} = useSnackbar();
    const [documents, setDocuments] = useState<DocumentSummaryResponse[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchDocuments = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await documentAPI.getAllDocuments(filter, sort);
            setDocuments(data);
        } catch (err) {
            showSnackbar(
                err instanceof Error ? err.message : "Failed to load documents.",
                "error"
            );
        } finally {
            setIsLoading(false);
        }
    }, [filter, sort, showSnackbar]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void fetchDocuments();
    }, [fetchDocuments]);

    return {
        documents,
        isLoading,
        refetch: fetchDocuments,
    };
};

export default useDocuments;