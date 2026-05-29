import type {Permission} from "./common.ts"

export interface CollaboratorResponse {
    email: string
    fullName: string
    permission: Permission
}

export interface ShareDocumentRequest {
    email: string
    permission: 'EDIT' | 'VIEW'
}