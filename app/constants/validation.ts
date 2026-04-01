export const VALIDATION_CONSTRAINTS = {
  ACCOUNT_NAME_MIN_LENGTH: 1,
  ACCOUNT_NAME_MAX_LENGTH: 100,
  PASSWORD_MIN_LENGTH: 1,
  PASSWORD_MAX_LENGTH: 12,
  NAME_MIN_LENGTH: 1,
  NAME_MAX_LENGTH: 100,
  MIN_AGE: 13,
} as const

export const VALIDATION_MESSAGES = {
  ACCOUNT_NAME_REQUIRED: 'Account name is required',
  ACCOUNT_NAME_MAX_LENGTH: `Account name length exceeded ${VALIDATION_CONSTRAINTS.ACCOUNT_NAME_MAX_LENGTH} characters`,
  ACCOUNT_NAME_INVALID_FORMAT:
    'Enter a valid email or username (letters, numbers, underscores only)',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_MAX_LENGTH: `Password length exceeded ${VALIDATION_CONSTRAINTS.PASSWORD_MAX_LENGTH} characters`,
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Enter a valid email address',
  NAME_REQUIRED: 'Name is required',
  NAME_MAX_LENGTH: `Name length exceeded ${VALIDATION_CONSTRAINTS.NAME_MAX_LENGTH} characters`,
  DOB_REQUIRED: 'Date of birth is required',
  DOB_INVALID: 'Enter a valid date of birth',
  DOB_MIN_AGE: `You must be at least ${VALIDATION_CONSTRAINTS.MIN_AGE} years old`,
} as const
