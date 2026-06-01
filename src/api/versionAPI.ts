import api from '../axios/axiosInstance'
import type {VersionContentResponse, VersionResponse} from './types/version'
import type { DocumentResponse } from './types/document'
import type { PageResponse } from './types/common'

const versionAPI = {

    getVersions: async (
        documentId: string,
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<VersionResponse>> => {
        const response = await api.get<PageResponse<VersionResponse>>(
            `/api/v1/documents/${documentId}/versions`,
            { params: { page, size } }
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