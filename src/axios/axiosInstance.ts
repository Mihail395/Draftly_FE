import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config
},
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {

        const isAuthEndpoint = error.config?.url?.includes("/api/v1/auth/");

        if (error.response?.status === 401 && !isAuthEndpoint) {
            localStorage.removeItem('token')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api