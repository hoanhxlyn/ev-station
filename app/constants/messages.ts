export const success = (subject: string) => `${subject} successful`
export const fail = (subject: string) => `${subject} failed`

export const LOGIN_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid credentials',
  CHECK_CREDENTIALS: 'Check your account name and password',
  SESSION_EXPIRED: 'Session expired, please log in again',
} as const

export const SIGNUP_MESSAGES = {
  REDIRECT_LOGIN: 'Redirecting to login...',
  COMPLETE_PROFILE: 'Complete your profile to continue',
  CHECK_EMAIL_HEADING: 'Check your email',
  CHECK_EMAIL_BODY:
    'We sent a verification link to your email address. Click it to activate your account.',
  CHECK_EMAIL_SPAM: "Don't see it? Check your spam folder.",
  RESEND_SUCCESS: 'Verification email resent successfully',
  RESEND_FAIL: 'Failed to resend verification email',
} as const

export const WALLET_MESSAGES = {
  TOP_UP_SUCCESS: 'Top-up successful',
  TOP_UP_FAIL: 'Top-up failed',
  REPAY_SUCCESS: 'Debt repayment successful',
  REPAY_FAIL: 'Debt repayment failed',
  IN_DEBT: 'Your account is in debt',
  BALANCE_LABEL: 'Credit balance',
  INVALID_ACTION: 'Invalid action',
} as const

export const VEHICLE_MESSAGES = {
  ADD_SUCCESS: 'Vehicle added successfully',
  ADD_FAIL: 'Failed to add vehicle',
  EDIT_SUCCESS: 'Vehicle updated successfully',
  EDIT_FAIL: 'Failed to update vehicle',
  DELETE_SUCCESS: 'Vehicle deleted successfully',
  DELETE_FAIL: 'Failed to delete vehicle',
  DELETE_ACTIVE_SESSION: 'Cannot delete vehicle with active charging session',
} as const

export const CHARGING_MESSAGES = {
  START_SUCCESS: 'Charging session started',
  START_FAIL: 'Failed to start charging session',
  END_SUCCESS: 'Charging session completed',
  END_FAIL: 'Failed to end charging session',
  CANCEL_SUCCESS: 'Charging session cancelled',
  CANCEL_FAIL: 'Failed to cancel charging session',
  NO_ACTIVE_SESSION: 'No active charging session',
  STATION_NOT_AVAILABLE: 'Station is not available',
  INSUFFICIENT_CREDITS: 'Insufficient credits. Please top up first.',
  VEHICLE_REQUIRED: 'Please add a vehicle first',
  INVALID_ACTION: 'Invalid action',
} as const

export const ADMIN_MESSAGES = {
  LOCK_SUCCESS: 'User account locked successfully',
  LOCK_FAIL: 'Failed to lock user account',
  UNLOCK_SUCCESS: 'User account unlocked successfully',
  UNLOCK_FAIL: 'Failed to unlock user account',
  CANNOT_LOCK_ADMIN: 'Cannot lock admin accounts',
} as const
