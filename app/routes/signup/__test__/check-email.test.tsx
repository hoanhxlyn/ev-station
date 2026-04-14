// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { MantineProvider } from '@mantine/core'
import SignupCheckEmail, { meta } from './check-email'
import { SIGNUP_MESSAGES } from '~/constants/messages'

vi.mock('./page.module.css', () => ({
  default: new Proxy(
    {},
    { get: (_target, prop) => (typeof prop === 'string' ? prop : '') },
  ),
}))

function renderStatic(searchParams = '') {
  const url = `/signup/check-email${searchParams}`
  return renderToString(
    <MantineProvider>
      <StaticRouter location={url}>
        <SignupCheckEmail />
      </StaticRouter>
    </MantineProvider>,
  )
}

describe('SignupCheckEmail', () => {
  it('renders the check-email heading', () => {
    const html = renderStatic()
    expect(html).toContain(SIGNUP_MESSAGES.CHECK_EMAIL_HEADING)
  })

  it('renders the body text', () => {
    const html = renderStatic()
    expect(html).toContain(SIGNUP_MESSAGES.CHECK_EMAIL_BODY)
  })

  it('renders the spam hint', () => {
    const html = renderStatic()
    expect(html).toContain('Check your spam folder')
  })

  it('shows email address when provided in URL', () => {
    const html = renderStatic('?email=test%40example.com')
    expect(html).toContain('test@example.com')
  })

  it('does not show email text when no email param', () => {
    const html = renderStatic()
    expect(html).not.toMatch(/test@example\.com/)
  })

  it('has a sign-in link pointing to login route', () => {
    const html = renderStatic()
    expect(html).toContain('href="/login"')
    expect(html).toContain('Sign in')
  })

  it('has a back-to-home link', () => {
    const html = renderStatic()
    expect(html).toContain('href="/"')
    expect(html).toContain('Back to home')
  })
})

describe('meta', () => {
  it('returns title and description', () => {
    const result = meta()
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: expect.stringContaining('Check your email'),
        }),
        expect.objectContaining({ name: 'description' }),
      ]),
    )
  })
})
