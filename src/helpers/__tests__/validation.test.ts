import { describe, it, expect } from 'vitest'
import { isValidEmail, isValidPassword, isValidCode, passwordsMatch } from '../validation'
import { VALIDATION } from '@/constants'

describe('validation helpers', () => {
  describe('isValidEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name@example.com')).toBe(true)
      expect(isValidEmail('user+tag@example.co.uk')).toBe(true)
    })

    it('should return false for invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false)
      expect(isValidEmail('invalid@')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
      expect(isValidEmail('test@')).toBe(false)
      expect(isValidEmail('')).toBe(false)
      expect(isValidEmail('a@b')).toBe(false) // too short
    })
  })

  describe('isValidPassword', () => {
    it('should return true for passwords meeting minimum length', () => {
      expect(isValidPassword('12345678')).toBe(true)
      expect(isValidPassword('password123')).toBe(true)
      expect(isValidPassword('a'.repeat(VALIDATION.MIN_PASSWORD_LENGTH))).toBe(true)
    })

    it('should return false for passwords below minimum length', () => {
      expect(isValidPassword('1234567')).toBe(false)
      expect(isValidPassword('short')).toBe(false)
      expect(isValidPassword('')).toBe(false)
    })
  })

  describe('isValidCode', () => {
    it('should return true for valid 6-digit codes', () => {
      expect(isValidCode('123456')).toBe(true)
      expect(isValidCode('000000')).toBe(true)
      expect(isValidCode('999999')).toBe(true)
    })

    it('should return false for invalid codes', () => {
      expect(isValidCode('12345')).toBe(false) // too short
      expect(isValidCode('1234567')).toBe(false) // too long
      expect(isValidCode('12345a')).toBe(false) // contains letter
      expect(isValidCode('abc123')).toBe(false) // contains letters
      expect(isValidCode('')).toBe(false) // empty
    })

    it('should support custom code length', () => {
      expect(isValidCode('1234', 4)).toBe(true)
      expect(isValidCode('12345678', 8)).toBe(true)
      expect(isValidCode('123', 4)).toBe(false)
    })
  })

  describe('passwordsMatch', () => {
    it('should return true when passwords match', () => {
      expect(passwordsMatch('password123', 'password123')).toBe(true)
      expect(passwordsMatch('', '')).toBe(true)
      expect(passwordsMatch('complex!@#$%', 'complex!@#$%')).toBe(true)
    })

    it('should return false when passwords do not match', () => {
      expect(passwordsMatch('password123', 'password124')).toBe(false)
      expect(passwordsMatch('Password123', 'password123')).toBe(false) // case sensitive
      expect(passwordsMatch('password', '')).toBe(false)
      expect(passwordsMatch('', 'password')).toBe(false)
    })
  })
})
