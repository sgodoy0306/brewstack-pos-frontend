import axios from 'axios'
import type { ApiErrorResponse } from '../types/error'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError: ApiErrorResponse = error.response?.data ?? {
      timestamp: new Date().toISOString(),
      status: 0,
      error: 'Network Error',
      message: 'Could not connect to server',
      path: '',
    }
    return Promise.reject(apiError)
  },
)

export default apiClient
