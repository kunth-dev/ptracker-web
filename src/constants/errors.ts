// API Error Codes from backend
export enum ErrorCode {
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  EMAIL_ALREADY_IN_USE = 'EMAIL_ALREADY_IN_USE',
  INVALID_RESET_CODE = 'INVALID_RESET_CODE',
  RESET_CODE_EXPIRED = 'RESET_CODE_EXPIRED',
  RESET_CODE_NOT_FOUND = 'RESET_CODE_NOT_FOUND',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
}

// Translation keys for error codes
export const ERROR_CODE_TRANSLATION_KEYS: Record<ErrorCode, string> = {
  [ErrorCode.VALIDATION_FAILED]: 'errors.validationFailed',
  [ErrorCode.INVALID_CREDENTIALS]: 'errors.invalidCredentials',
  [ErrorCode.USER_NOT_FOUND]: 'errors.userNotFound',
  [ErrorCode.USER_ALREADY_EXISTS]: 'errors.userAlreadyExists',
  [ErrorCode.EMAIL_ALREADY_IN_USE]: 'errors.emailAlreadyInUse',
  [ErrorCode.INVALID_RESET_CODE]: 'errors.invalidResetCode',
  [ErrorCode.RESET_CODE_EXPIRED]: 'errors.resetCodeExpired',
  [ErrorCode.RESET_CODE_NOT_FOUND]: 'errors.resetCodeNotFound',
  [ErrorCode.MISSING_REQUIRED_FIELD]: 'errors.missingRequiredField',
}
