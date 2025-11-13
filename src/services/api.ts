import axios, { AxiosInstance, AxiosError } from 'axios'
import { API_BASE_URL, API_BEARER_TOKEN } from '@/constants'
import type { ApiResponse, ApiErrorResponse } from '@/types'

class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor to add auth token for protected routes
    this.api.interceptors.request.use((config) => {
      // Add bearer token to protected routes
      if (API_BEARER_TOKEN && this.isProtectedRoute(config.url || '')) {
        config.headers.Authorization = `Bearer ${API_BEARER_TOKEN}`
      }
      return config
    })

    // Response interceptor to handle errors uniformly
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiErrorResponse>) => {
        return Promise.reject(error)
      }
    )
  }

  private isProtectedRoute(url: string): boolean {
    // Protected routes include /user
    return url.includes('/user')
  }

  async get<T>(url: string): Promise<ApiResponse<T>> {
    const response = await this.api.get<ApiResponse<T>>(url)
    return response.data
  }

  async post<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    const response = await this.api.post<ApiResponse<T>>(url, data)
    return response.data
  }

  async patch<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    const response = await this.api.patch<ApiResponse<T>>(url, data)
    return response.data
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    const response = await this.api.delete<ApiResponse<T>>(url)
    return response.data
  }

  getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiErrorResponse>
      return axiosError.response?.data?.error || axiosError.message || 'An error occurred'
    }
    if (error instanceof Error) {
      return error.message
    }
    return 'An error occurred'
  }

  getErrorCode(error: unknown): string | null {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiErrorResponse>
      return axiosError.response?.data?.errorCode || null
    }
    return null
  }
}

export const apiService = new ApiService()
