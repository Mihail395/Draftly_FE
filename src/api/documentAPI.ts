import api from '../axios/axiosInstance'
import type { DocumentResponse, DocumentSummaryResponse, CreateDocumentRequest, UpdateDocumentRequest, CollabAccessResponse } from './types/document'
import type { DocumentFilter, SortField, PageResponse } from './types/common'

const documentAPI = {

    getAllDocuments: async (
        filter: DocumentFilter = 'ALL',
        sort: SortField = 'UPDATED_AT',
        page: number = 0,
        size: number = 20,
        search: string = ''
    ): Promise<PageResponse<DocumentSummaryResponse>> => {
        const params: Record<string, string | number> = { filter, sort, page, size }
        if (search.trim()) {
            params.search = search.trim()
        }
        const response = await api.get<PageResponse<DocumentSummaryResponse>>('/api/v1/documents', {
            params
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

    checkCollabAccess: async (id: string): Promise<CollabAccessResponse> => {
        const response = await api.get<CollabAccessResponse>(`/api/v1/documents/${id}/collab-access`)
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