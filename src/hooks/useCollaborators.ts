import { useState, useEffect, useCallback } from "react";
import collaboratorAPI from "../api/collaboratorAPI";
import type { CollaboratorResponse, ShareDocumentRequest } from "../api/types/collaborator";
import useSnackbar from "./useSnackbar";

interface UseCollaboratorsReturn {
    collaborators: CollaboratorResponse[];
    isLoading: boolean;
    addCollaborator: (request: ShareDocumentRequest) => Promise<void>;
    removeCollaborator: (userId: string) => Promise<void>;
    refetch: () => void;
}

const useCollaborators = (documentId: string): UseCollaboratorsReturn => {
    const {showSnackbar} = useSnackbar();
    const [collaborators, setCollaborators] = useState<CollaboratorResponse[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchCollaborators = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await collaboratorAPI.getCollaborators(documentId);
            setCollaborators(data);
        } catch (err) {
            showSnackbar(
                err instanceof Error ? err.message : "Failed to load collaborators.",
                "error"
            );
        } finally {
            setIsLoading(false);
        }
    }, [documentId, showSnackbar]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void fetchCollaborators();
    }, [fetchCollaborators]);

    const addCollaborator = useCallback(async (request: ShareDocumentRequest) => {
        try {
            const newCollaborator = await collaboratorAPI.addCollaborator(documentId, request);
            setCollaborators((prev) => [...prev, newCollaborator]);
            showSnackbar("Collaborator added successfully.", "success");
        } catch (err) {
            showSnackbar(
                err instanceof Error ? err.message : "Failed to add collaborator.",
                "error"
            );
        }
    }, [documentId, showSnackbar]);

    const removeCollaborator = useCallback(async (email: string) => {
        try {
            await collaboratorAPI.removeCollaborator(documentId, email);
            setCollaborators((prev) =>
                prev.filter((collaborator) => collaborator.email !== email)
            );
            showSnackbar("Collaborator removed successfully.", "success");
        } catch (err) {
            showSnackbar(
                err instanceof Error ? err.message : "Failed to remove collaborator.",
                "error"
            );
        }
    }, [documentId, showSnackbar]);

    return {
        collaborators,
        isLoading,
        addCollaborator,
        removeCollaborator,
        refetch: fetchCollaborators,
    };
};

export default useCollaborators;