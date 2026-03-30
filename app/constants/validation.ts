export const VALIDATION_CONSTRAINTS = {
  ACCOUNT_NAME_MIN_LENGTH: 1,
  ACCOUNT_NAME_MAX_LENGTH: 100,
  PASSWORD_MIN_LENGTH: 1,
  PASSWORD_MAX_LENGTH: 12,
} as const

export const VALIDATION_MESSAGES = {
  ACCOUNT_NAME_REQUIRED: 'Account name is required',
  ACCOUNT_NAME_MAX_LENGTH: `Account name length exceeded ${VALIDATION_CONSTRAINTS.ACCOUNT_NAME_MAX_LENGTH} characters`,
  ACCOUNT_NAME_INVALID_FORMAT:
    'Enter a valid email or username (letters, numbers, underscores only)',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_MAX_LENGTH: `Password length exceeded ${VALIDATION_CONSTRAINTS.PASSWORD_MAX_LENGTH} characters`,
} as const
