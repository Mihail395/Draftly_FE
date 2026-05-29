import { useState, useEffect, useCallback } from "react";
import versionAPI from "../api/versionAPI";
import type { VersionResponse } from "../api/types/version";
import type { DocumentResponse } from "../api/types/document";
import useSnackbar from "./useSnackbar";

interface UseVersionsReturn {
    versions: VersionResponse[];
    isLoading: boolean;
    isRestoring: boolean;
    restoreVersion: (versionId: string) => Promise<DocumentResponse | null>;
    refetch: () => void;
}

const useVersions = (documentId: string): UseVersionsReturn => {
    const {showSnackbar} = useSnackbar();
    const [versions, setVersions] = useState<VersionResponse[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isRestoring, setIsRestoring] = useState<boolean>(false);

    const fetchVersions = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await versionAPI.getVersions(documentId);
            setVersions(data);
        } catch (err) {
            showSnackbar(
                err instanceof Error ? err.message : "Failed to load version history.",
                "error"
            );
        } finally {
            setIsLoading(false);
        }
    }, [documentId, showSnackbar]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void fetchVersions();
    }, [fetchVersions]);

    const restoreVersion = useCallback(async (versionId: string): Promise<DocumentResponse | null> => {
        setIsRestoring(true);
        try {
            const updatedDocument = await versionAPI.restoreVersion(documentId, versionId);
            // Re-fetch versions because a new snapshot was created before restoring
            await fetchVersions();
            showSnackbar("Document restored successfully.", "success");
            return updatedDocument;
        } catch (err) {
            showSnackbar(
                err instanceof Error ? err.message : "Failed to restore version.",
                "error"
            );
            return null;
        } finally {
            setIsRestoring(false);
        }
    }, [documentId, fetchVersions, showSnackbar]);

    return {
        versions,
        isLoading,
        isRestoring,
        restoreVersion,
        refetch: fetchVersions,
    };
};

export default useVersions;