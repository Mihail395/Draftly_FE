export interface UserResponse {
    email: string
    firstName: string
    lastName: string
}

export interface UpdateUserRequest {
    firstName: string
    lastName: string
}