import api from '../axios/axiosInstance'
import type { UserResponse, UpdateUserRequest } from './types/user'
import type { PageResponse } from './types/common'

const userAPI = {

    getUserById: async (id: string): Promise<UserResponse> => {
        const response = await api.get<UserResponse>(`/api/v1/users/${id}`)
        return response.data
    },

    updateUser: async (request: UpdateUserRequest): Promise<UserResponse> => {
        const response = await api.put<UserResponse>(`/api/v1/users/me`, request)
        return response.data
    },

    searchUsersByEmail: async (
        email: string,
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<UserResponse>> => {
        const response = await api.get<PageResponse<UserResponse>>('/api/v1/users/search', {
            params: { email, page, size }
        })
        return response.data
    },
}

export default userAPI