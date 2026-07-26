import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import type { Token } from "./auth";

// VITE_API_URL=http://127.0.0.1:8000

interface RetryConfig extends InternalAxiosRequestConfig {
    _retry?: boolean
}

const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 5000,
    headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

let refreshPromise: Promise<string> | null = null

const refreshAccessToken = async (): Promise<string> => {
    const refresh_token = localStorage.getItem("refresh_token")

    if (!refresh_token)
        throw new Error("No refresh token available")

    try{
        const response = await axios.post<Token>(
            `${import.meta.env.VITE_API_URL}/api/users/token/refresh`,
            {"token": refresh_token}
        )
        localStorage.setItem("token", response.data.access_token)
        return response.data.access_token
    
    } catch (err) {
        localStorage.removeItem("token")
        localStorage.removeItem("refresh_token")
        window.location.href = "/login"
        throw err
    }
}

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config as RetryConfig

        if (error.response?.status !== 401 || originalRequest._retry || originalRequest.url === "/api/users/token") {
            return Promise.reject(error)
        }

        originalRequest._retry = true

        if (!refreshPromise){
            refreshPromise = refreshAccessToken().finally(() => {
                refreshPromise = null
            })
        }

        const newToken = await refreshPromise

        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api.request(originalRequest)
    }
)


export default api
