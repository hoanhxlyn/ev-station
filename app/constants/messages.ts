export const success = (subject: string) => `${subject} successful`
export const fail = (subject: string) => `${subject} failed`

export const LOGIN_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid credentials',
  CHECK_CREDENTIALS: 'Check your account name and password',
} as const

export const SIGNUP_MESSAGES = {
  REDIRECT_LOGIN: 'Redirecting to login...',
  COMPLETE_PROFILE: 'Complete your profile to continue',
  CHECK_EMAIL_HEADING: 'Check your email',
  CHECK_EMAIL_BODY:
    'We sent a verification link to your email address. Click it to activate your account.',
  CHECK_EMAIL_SPAM: "Don't see it? Check your spam folder.",
} as const
