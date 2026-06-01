import { useState, useEffect, useCallback } from "react";
import documentAPI from "../api/documentAPI";
import type { DocumentSummaryResponse } from "../api/types/document";
import type { DocumentFilter, SortField } from "../api/types/common";
import useSnackbar from "./useSnackbar";

interface UseDocumentsReturn {
    documents: DocumentSummaryResponse[];
    isLoading: boolean;
    totalPages: number;
    totalElements: number;
    currentPage: number;
    setPage: (page: number) => void;
    refetch: () => void;
}

const useDocuments = (
    filter: DocumentFilter = "ALL",
    sort: SortField = "UPDATED_AT",
    initialPage: number = 0,
    size: number = 20,
    search: string = ""
): UseDocumentsReturn => {
    const {showSnackbar} = useSnackbar();
    const [documents, setDocuments] = useState<DocumentSummaryResponse[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(initialPage);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);

    const fetchDocuments = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await documentAPI.getAllDocuments(filter, sort, page, size, search);
            setDocuments(data.content);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
        } catch (err) {
            showSnackbar(
                err instanceof Error ? err.message : "Failed to load documents.",
                "error"
            );
        } finally {
            setIsLoading(false);
        }
    }, [filter, sort, page, size, search, showSnackbar]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void fetchDocuments();
    }, [fetchDocuments]);

    return {
        documents,
        isLoading,
        totalPages,
        totalElements,
        currentPage: page,
        setPage,
        refetch: fetchDocuments,
    };
};

export default useDocuments;
