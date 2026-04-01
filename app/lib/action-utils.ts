import {
  dataWithSuccess,
  dataWithError,
  redirectWithSuccess,
  redirectWithError,
} from 'remix-toast'

/**
 * Return data with success toast notification
 */
export function respondSuccess<T>(data: T, message: string) {
  return dataWithSuccess(data, message)
}

/**
 * Return data with error toast notification
 */
export function respondFail<T>(data: T, message: string) {
  return dataWithError(data, message)
}

/**
 * Redirect with success toast notification
 */
export function redirectSuccess(url: string, message: string) {
  return redirectWithSuccess(url, message)
}

/**
 * Redirect with error toast notification
 */
export function redirectFail(url: string, message: string) {
  return redirectWithError(url, message)
}
