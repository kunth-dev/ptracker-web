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

export interface VerifyEmailRequest {
  email: string
  code: string
}

export interface ResendVerificationCodeRequest {
  email: string
}

export interface SendResetCodeRequest {
  email: string
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

export interface RegisterResponse {
  userId: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface ForgotPasswordResponse {
  expiresAt: string
}
