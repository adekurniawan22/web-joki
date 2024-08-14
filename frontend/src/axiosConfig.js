import axios from 'axios'
import config from './config'

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: config.apiUrl,
})

// Request interceptor to add token to every request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error),
)

// Response interceptor if needed
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error),
)

export default axiosInstance
