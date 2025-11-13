import { ErrorCode, ERROR_CODE_TRANSLATION_KEYS } from '@/constants'
import { apiService } from '@/services/api'

/**
 * Gets the translation key for an error code
 */
export function getErrorTranslationKey(errorCode: string | null): string | null {
  if (!errorCode || !(errorCode in ErrorCode)) {
    return null
  }
  return ERROR_CODE_TRANSLATION_KEYS[errorCode as ErrorCode]
}

/**
 * Extracts error message from an error object
 */
export function getErrorMessage(error: unknown): string {
  return apiService.getErrorMessage(error)
}

/**
 * Extracts error code from an error object
 */
export function getErrorCode(error: unknown): string | null {
  return apiService.getErrorCode(error)
}
