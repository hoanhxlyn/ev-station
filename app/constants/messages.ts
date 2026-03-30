export const LOGIN_MESSAGES = {
  SUCCESS: 'Login Successful',
  INVALID_CREDENTIALS: 'Invalid credentials',
  CHECK_CREDENTIALS: 'Check your account name and password',
} as const

export const VALIDATION_MESSAGES = {
  ACCOUNT_NAME_REQUIRED: 'Account name is required',
  ACCOUNT_NAME_MAX_LENGTH: 'Account name length exceeded 100 characters',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_MAX_LENGTH: 'Password length exceeded 12 characters',
} as const
