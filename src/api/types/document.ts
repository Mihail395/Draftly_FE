import type {Permission} from "./common.ts"

export interface DocumentSummaryResponse {
    id: string
    title: string
    ownerName: string
    permission: Permission
    createdAt: string
    updatedAt: string
}

export interface DocumentResponse {
    id: string
    title: string
    content: string | null
    ownerName: string
    permission: Permission
    createdAt: string
    updatedAt: string
}

export interface CollabAccessResponse {
    allowed: boolean
    permission: Permission | null
}

export interface CreateDocumentRequest {
    title: string
}

export interface UpdateDocumentRequest {
    title: string
    content: string | null
    contentLength: number
}

export interface RenameDocumentRequest {
    title: string
}