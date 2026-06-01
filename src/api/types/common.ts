export type Permission = 'OWNER' | 'EDIT' | 'VIEW'
export type DocumentFilter = 'ALL' | 'OWNED' | 'SHARED'
export type SortField = 'TITLE' | 'CREATED_AT' | 'UPDATED_AT'

// Mirrors the Spring Data Page shape returned by paginated endpoints
export interface PageResponse<T> {
    content: T[]
    totalElements: number
    totalPages: number
    number: number
    size: number
    first: boolean
    last: boolean
}