import axios from 'axios'
import type { ApiErrorResponse } from '../types/error'

/**
 * The API base URL is read from the environment at build time.
 * - Development: loaded from .env.development (VITE_API_BASE_URL)
 * - Production:  loaded from .env.production  (VITE_API_BASE_URL)
 *
 * The fallback to localhost:8181 keeps the dev server functional if the
 * .env file is missing, without silently pointing at a wrong host.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8181/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
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
      message: 'Could not connect to server. Check your connection and try again.',
      path: '',
    }
    return Promise.reject(apiError)
  },
)

export default apiClient
