import api from '../axios/axiosInstance'
import type { UserResponse, UpdateUserRequest } from './types/user'

const userAPI = {

    getUserById: async (id: string): Promise<UserResponse> => {
        const response = await api.get<UserResponse>(`/api/v1/users/${id}`)
        return response.data
    },

    updateUser: async (request: UpdateUserRequest): Promise<UserResponse> => {
        const response = await api.put<UserResponse>(`/api/v1/users/me`, request)
        return response.data
    },

    searchUsersByEmail: async (email: string): Promise<UserResponse[]> => {
        const response = await api.get<UserResponse[]>('/api/v1/users/search', {
            params: { email }
        })
        return response.data
    },
}

export default userAPI