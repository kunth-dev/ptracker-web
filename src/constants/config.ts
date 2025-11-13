export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002/api'
export const API_BEARER_TOKEN = import.meta.env.VITE_API_BEARER_TOKEN || ''
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'PTracker'

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints (public)
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  FORGOT_PASSWORD: '/auth/forgot-password',
  SEND_RESET_CODE: '/auth/send-reset-code',
  RESET_PASSWORD: '/auth/reset-password',

  // User endpoints (protected)
  GET_USER: (userId: string) => `/user/${userId}`,
  UPDATE_USER: (userId: string) => `/user/${userId}`,
  DELETE_USER: (userId: string) => `/user/${userId}`,
} as const

// Validation constants
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MIN_EMAIL_LENGTH: 5,
  OTP_LENGTH: 6,
  RESET_CODE_LENGTH: 6,
} as const
