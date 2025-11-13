import { describe, it, expect } from 'vitest'
import { getErrorTranslationKey } from '../error'
import { ErrorCode } from '@/constants'

describe('error helpers', () => {
  describe('getErrorTranslationKey', () => {
    it('should return correct translation key for valid error codes', () => {
      expect(getErrorTranslationKey(ErrorCode.VALIDATION_FAILED)).toBe('errors.validationFailed')
      expect(getErrorTranslationKey(ErrorCode.INVALID_CREDENTIALS)).toBe(
        'errors.invalidCredentials'
      )
      expect(getErrorTranslationKey(ErrorCode.USER_NOT_FOUND)).toBe('errors.userNotFound')
      expect(getErrorTranslationKey(ErrorCode.USER_ALREADY_EXISTS)).toBe(
        'errors.userAlreadyExists'
      )
    })

    it('should return null for invalid error codes', () => {
      expect(getErrorTranslationKey('INVALID_CODE')).toBe(null)
      expect(getErrorTranslationKey(null)).toBe(null)
      expect(getErrorTranslationKey('')).toBe(null)
    })
  })
})
