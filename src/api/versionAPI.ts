import api from '../axios/axiosInstance'
import type {VersionContentResponse, VersionResponse} from './types/version'
import type { DocumentResponse } from './types/document'

const versionAPI = {

    getVersions: async (documentId: string): Promise<VersionResponse[]> => {
        const response = await api.get<VersionResponse[]>(
            `/api/v1/documents/${documentId}/versions`
        )
        return response.data
    },

    getVersionContent: async (
        documentId: string,
        versionId: string
    ): Promise<VersionContentResponse> => {
        const response = await api.get<VersionContentResponse>(
            `/api/v1/documents/${documentId}/versions/${versionId}`
        );
        return response.data;
    },

    restoreVersion: async (
        documentId: string,
        versionId: string
    ): Promise<DocumentResponse> => {
        const response = await api.put<DocumentResponse>(
            `/api/v1/documents/${documentId}/versions/${versionId}/restore`
        )
        return response.data
    },
}

export default versionAPI