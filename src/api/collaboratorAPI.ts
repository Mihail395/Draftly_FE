import api from '../axios/axiosInstance'
import type { CollaboratorResponse, ShareDocumentRequest } from './types/collaborator'

const collaboratorAPI = {

    getCollaborators: async (documentId: string): Promise<CollaboratorResponse[]> => {
        const response = await api.get<CollaboratorResponse[]>(
            `/api/v1/documents/${documentId}/collaborators`
        )
        return response.data
    },

    addCollaborator: async (
        documentId: string,
        request: ShareDocumentRequest
    ): Promise<CollaboratorResponse> => {
        const response = await api.post<CollaboratorResponse>(
            `/api/v1/documents/${documentId}/collaborators`,
            request
        )
        return response.data
    },

    removeCollaborator: async (documentId: string, email: string): Promise<void> => {
        await api.delete(`/api/v1/documents/${documentId}/collaborators`, {
            params: { email },
        });
    },
}

export default collaboratorAPI