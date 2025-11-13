import { VALIDATION } from '@/constants'

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length >= VALIDATION.MIN_EMAIL_LENGTH
}

/**
 * Validates password length
 */
export function isValidPassword(password: string): boolean {
  return password.length >= VALIDATION.MIN_PASSWORD_LENGTH
}

/**
 * Validates OTP/reset code format
 */
export function isValidCode(code: string, length: number = VALIDATION.OTP_LENGTH): boolean {
  const codeRegex = new RegExp(`^\\d{${length}}$`)
  return codeRegex.test(code)
}

/**
 * Checks if two passwords match
 */
export function passwordsMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword
}
