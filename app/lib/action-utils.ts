import {
  dataWithSuccess,
  dataWithError,
  redirectWithSuccess,
  redirectWithError,
} from 'remix-toast'
import { authErrorSchema } from '~/schemas/auth'

/**
 * Extract an error message from a better-auth Response, falling back to the given default.
 */
export async function extractErrorMessage(
  response: Response,
  fallback: string,
): Promise<string> {
  try {
    const result = authErrorSchema.safeParse(await response.clone().json())
    if (!result.success) return fallback
    return result.data.error?.message ?? result.data.message ?? fallback
  } catch {
    return fallback
  }
}

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
