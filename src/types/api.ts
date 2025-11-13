// User types
export interface User {
  userId: string
  email: string
  createdAt: string
  updatedAt: string
}

// Auth types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  email: string
  code: string
  newPassword: string
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
}

export interface ApiErrorResponse {
  success: false
  error: string
  errorCode: string
  message?: string
  timestamp?: string
}

// Auth response types
export interface LoginResponse {
  userId: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface RegisterResponse extends LoginResponse {}

export interface ForgotPasswordResponse {
  expiresAt: string
}
