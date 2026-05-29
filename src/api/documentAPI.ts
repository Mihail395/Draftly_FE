import api from '../axios/axiosInstance'
import type { DocumentResponse, DocumentSummaryResponse, CreateDocumentRequest, UpdateDocumentRequest } from './types/document'
import type { DocumentFilter, SortField } from './types/common'

const documentAPI = {

    getAllDocuments: async (
        filter: DocumentFilter = 'ALL',
        sort: SortField = 'UPDATED_AT'
    ): Promise<DocumentSummaryResponse[]> => {
        const response = await api.get<DocumentSummaryResponse[]>('/api/v1/documents', {
            params: { filter, sort }
        })
        return response.data
    },

    createDocument: async (request: CreateDocumentRequest): Promise<DocumentResponse> => {
        const response = await api.post<DocumentResponse>('/api/v1/documents', request)
        return response.data
    },

    getDocumentById: async (id: string): Promise<DocumentResponse> => {
        const response = await api.get<DocumentResponse>(`/api/v1/documents/${id}`)
        return response.data
    },

    updateDocument: async (id: string, request: UpdateDocumentRequest): Promise<DocumentResponse> => {
        const response = await api.put<DocumentResponse>(`/api/v1/documents/${id}`, request)
        return response.data
    },

    deleteDocument: async (id: string): Promise<void> => {
        await api.delete(`/api/v1/documents/${id}`)
    },

    renameDocument: async (id: string, title: string): Promise<DocumentResponse> => {
        const response = await api.patch<DocumentResponse>(
            `/api/v1/documents/${id}/rename`,
            null,
            { params: { title } }
        )
        return response.data
    },

    searchDocuments: async (title: string): Promise<DocumentSummaryResponse[]> => {
        const response = await api.get<DocumentSummaryResponse[]>('/api/v1/documents/search', {
            params: { title }
        })
        return response.data
    },
}

export default documentAPI