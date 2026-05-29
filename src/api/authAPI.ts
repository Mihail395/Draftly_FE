import api from '../axios/axiosInstance'
import type { LoginRequest, RegisterRequest, AuthResponse } from './types/auth'
import type { UserResponse } from './types/user'

const authAPI = {

    register : async (request : RegisterRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/api/v1/auth/register', request)
        return response.data
    },

    login : async (request : LoginRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/api/v1/auth/login', request)
        return response.data
    },

    getCurrentUser: async (): Promise<UserResponse> => {
        const response = await api.get<UserResponse>('/api/v1/auth/me')
        return response.data
    },
}

export default authAPI