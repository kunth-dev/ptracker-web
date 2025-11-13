import { apiService } from './api'
import { API_ENDPOINTS } from '@/constants'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ApiResponse,
  User,
} from '@/types'

export const authService = {
  async register(data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    return apiService.post<RegisterResponse>(API_ENDPOINTS.REGISTER, data)
  },

  async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return apiService.post<LoginResponse>(API_ENDPOINTS.LOGIN, data)
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<ForgotPasswordResponse>> {
    return apiService.post<ForgotPasswordResponse>(API_ENDPOINTS.FORGOT_PASSWORD, data)
  },

  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<void>> {
    return apiService.post<void>(API_ENDPOINTS.RESET_PASSWORD, data)
  },
}

export const userService = {
  async getUser(userId: string): Promise<ApiResponse<User>> {
    return apiService.get<User>(API_ENDPOINTS.GET_USER(userId))
  },

  async updateUser(
    userId: string,
    data: { email?: string; password?: string }
  ): Promise<ApiResponse<User>> {
    return apiService.patch<User>(API_ENDPOINTS.UPDATE_USER(userId), data)
  },

  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(API_ENDPOINTS.DELETE_USER(userId))
  },
}
