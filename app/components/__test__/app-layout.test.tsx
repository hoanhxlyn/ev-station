// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderToString } from 'react-dom/server'
import { MantineProvider } from '@mantine/core'
import { AppLayout } from '../app-layout'

vi.mock('~/lib/auth-client', () => ({
  authClient: { signOut: vi.fn() },
}))

const mockUseRouteLoaderData = vi.fn()

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router')
  return {
    ...actual,
    useRouteLoaderData: (...args: unknown[]) => mockUseRouteLoaderData(...args),
    Outlet: () => <div data-testid="outlet">Main Content</div>,
    Link: ({
      children,
      to,
      ...props
    }: {
      children: React.ReactNode
      to: string
      [key: string]: unknown
    }) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  }
})

function renderLayoutToString(userRole: string | undefined) {
  mockUseRouteLoaderData.mockReturnValue({ user: { role: userRole } })

  const html = renderToString(
    <MantineProvider>
      <AppLayout />
    </MantineProvider>,
  )
  return html
}

describe('AppLayout', () => {
  beforeEach(() => {
    mockUseRouteLoaderData.mockReset()
  })

  it('renders sidebar with navigation', () => {
    const html = renderLayoutToString('user')
    expect(html).toContain('EV Station')
    expect(html).toContain('Dashboard')
    expect(html).toContain('Wallet')
    expect(html).toContain('Charging')
    expect(html).toContain('Vehicles')
    expect(html).toContain('Profile')
    expect(html).toContain('Sign out')
  })

  it('shows admin navigation for admin users', () => {
    const html = renderLayoutToString('admin')
    expect(html).toContain('Admin Dashboard')
    expect(html).toContain('User Management')
  })

  it('does not show admin navigation for regular users', () => {
    const html = renderLayoutToString('user')
    expect(html).not.toContain('Admin Dashboard')
    expect(html).not.toContain('User Management')
  })

  it('matches snapshot with regular user', () => {
    const html = renderLayoutToString('user')
    expect(html).toMatchSnapshot()
  })

  it('matches snapshot with admin user', () => {
    const html = renderLayoutToString('admin')
    expect(html).toMatchSnapshot()
  })

  it('matches snapshot with no user role', () => {
    const html = renderLayoutToString(undefined as unknown as string)
    expect(html).toMatchSnapshot()
  })
})
