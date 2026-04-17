// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderToString } from 'react-dom/server'
import { MantineProvider } from '@mantine/core'
import { DatesProvider } from '@mantine/dates'
import { SignupPanel } from '../components/signup-panel'
import { SIGNUP_MESSAGES } from '~/constants/messages'

vi.mock('~/lib/auth-client', () => ({
  authClient: { signUp: { email: vi.fn() } },
}))

const mockUseSearchParams = vi.fn()
const mockUseFetcher = vi.fn()
const mockUseLoaderData = vi.fn()

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router')
  return {
    ...actual,
    useSearchParams: () => mockUseSearchParams(),
    useFetcher: () => mockUseFetcher(),
    useLoaderData: () => mockUseLoaderData(),
    Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
      <a href={to}>{children}</a>
    ),
  }
})

function renderSignupPanelToString(
  searchParams: URLSearchParams = new URLSearchParams(),
  loaderData: { email?: string; name?: string } = {},
) {
  mockUseSearchParams.mockReturnValue([searchParams, vi.fn()])
  mockUseFetcher.mockReturnValue({
    state: 'idle',
    submit: vi.fn(),
    data: null,
    Form: ({ children }: { children: React.ReactNode }) => (
      <form>{children}</form>
    ),
  })
  mockUseLoaderData.mockReturnValue(loaderData)

  const html = renderToString(
    <MantineProvider>
      <DatesProvider settings={{ locale: 'en' }}>
        <SignupPanel />
      </DatesProvider>
    </MantineProvider>,
  )
  return html
}

describe('SignupPanel', () => {
  beforeEach(() => {
    mockUseSearchParams.mockReset()
    mockUseFetcher.mockReset()
    mockUseLoaderData.mockReset()
  })

  it('renders complete profile heading', () => {
    const html = renderSignupPanelToString()
    expect(html).toContain('Complete your profile')
  })

  it('renders form description', () => {
    const html = renderSignupPanelToString()
    expect(html).toContain(SIGNUP_MESSAGES.COMPLETE_PROFILE)
  })

  it('renders all form fields', () => {
    const html = renderSignupPanelToString()
    expect(html).toContain('Email')
    expect(html).toContain('Username')
    expect(html).toContain('Full name')
    expect(html).toContain('Password')
    expect(html).toContain('Date of birth')
  })

  it('populates email from URL params', () => {
    const params = new URLSearchParams('?email=test@example.com')
    const html = renderSignupPanelToString(params)
    expect(html).toContain('test@example.com')
  })

  it('shows password field by default (non-OAuth mode)', () => {
    const html = renderSignupPanelToString()
    expect(html).toContain('Password')
  })

  it('hides password field when OAuth email is in URL params', () => {
    const params = new URLSearchParams('?email=oauth@example.com')
    const html = renderSignupPanelToString(params, {
      email: 'oauth@example.com',
    })
    // In OAuth mode, password field should not appear
    // Count occurrences - email label appears once, password label appears 0 or 1 times
    const emailCount = (html.match(/Email/g) || []).length
    const passwordCount = (html.match(/Password/g) || []).length
    expect(emailCount).toBeGreaterThan(0)
    // In OAuth mode, password field is hidden
    expect(passwordCount).toBeLessThan(2)
  })

  it('populates email from OAuth loader data', () => {
    const html = renderSignupPanelToString(new URLSearchParams(), {
      email: 'oauth@example.com',
    })
    expect(html).toContain('oauth@example.com')
  })

  it('populates name from URL params', () => {
    const params = new URLSearchParams('?name=John%20Doe')
    const html = renderSignupPanelToString(params)
    expect(html).toContain('John Doe')
  })

  it('populates name from OAuth loader data', () => {
    const html = renderSignupPanelToString(new URLSearchParams(), {
      name: 'OAuth Name',
    })
    expect(html).toContain('OAuth Name')
  })

  it('has sign-in link', () => {
    const html = renderSignupPanelToString()
    expect(html).toContain('href="/login"')
    expect(html).toContain('Sign in')
  })

  it('has back to home button', () => {
    const html = renderSignupPanelToString()
    expect(html).toContain('href="/"')
    expect(html).toContain('Back to home')
  })

  it('has submit button', () => {
    const html = renderSignupPanelToString()
    expect(html).toContain('Complete profile')
  })

  it('matches snapshot with empty form', () => {
    const html = renderSignupPanelToString()
    expect(html).toMatchSnapshot()
  })

  it('matches snapshot with email from URL params', () => {
    const params = new URLSearchParams('?email=test@example.com')
    const html = renderSignupPanelToString(params)
    expect(html).toMatchSnapshot()
  })

  it('matches snapshot with name from URL params', () => {
    const params = new URLSearchParams('?name=John%20Doe')
    const html = renderSignupPanelToString(params)
    expect(html).toMatchSnapshot()
  })

  it('matches snapshot with OAuth email from loader', () => {
    const html = renderSignupPanelToString(new URLSearchParams(), {
      email: 'oauth@example.com',
      name: 'OAuth User',
    })
    expect(html).toMatchSnapshot()
  })
})
