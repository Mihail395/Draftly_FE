export interface VersionResponse {
    id: string
    savedByName: string
    createdAt: string
}

export interface VersionContentResponse {
    id: string;
    content: string | null;
    savedByName: string;
    createdAt: string;
}