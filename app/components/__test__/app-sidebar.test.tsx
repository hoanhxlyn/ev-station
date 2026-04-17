import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { MantineProvider } from '@mantine/core'
import { MemoryRouter } from 'react-router'
import { AppShell } from '@mantine/core'
import { AppSidebar } from '../app-sidebar'

vi.mock('~/lib/auth-client', () => ({
  authClient: { signOut: vi.fn() },
}))

function renderSidebar(isAdmin = false) {
  const { container } = render(
    <MantineProvider>
      <MemoryRouter>
        <AppShell>
          <AppSidebar isAdmin={isAdmin} />
        </AppShell>
      </MemoryRouter>
    </MantineProvider>,
  )

  container.querySelectorAll('[id]').forEach((el) => {
    if (el.id.startsWith('mantine-')) {
      el.removeAttribute('id')
    }
  })

  return container
}

describe('AppSidebar', () => {
  it('matches snapshot for regular user', () => {
    const container = renderSidebar(false)
    expect(container).toMatchSnapshot()
  })

  it('matches snapshot for admin user', () => {
    const container = renderSidebar(true)
    expect(container).toMatchSnapshot()
  })

  it('renders all navigation items', () => {
    const { getByText } = render(
      <MantineProvider>
        <MemoryRouter>
          <AppShell>
            <AppSidebar />
          </AppShell>
        </MemoryRouter>
      </MantineProvider>,
    )

    expect(getByText('EV Station')).toBeTruthy()
    expect(getByText('Dashboard')).toBeTruthy()
    expect(getByText('Wallet')).toBeTruthy()
    expect(getByText('Charging')).toBeTruthy()
    expect(getByText('Vehicles')).toBeTruthy()
    expect(getByText('Profile')).toBeTruthy()
    expect(getByText('Sign out')).toBeTruthy()
  })

  it('renders admin items when isAdmin is true', () => {
    const { getByText } = render(
      <MantineProvider>
        <MemoryRouter>
          <AppShell>
            <AppSidebar isAdmin={true} />
          </AppShell>
        </MemoryRouter>
      </MantineProvider>,
    )

    expect(getByText('Admin Dashboard')).toBeTruthy()
    expect(getByText('User Management')).toBeTruthy()
  })

  it('does not render admin items when isAdmin is false', () => {
    const { queryByText } = render(
      <MantineProvider>
        <MemoryRouter>
          <AppShell>
            <AppSidebar isAdmin={false} />
          </AppShell>
        </MemoryRouter>
      </MantineProvider>,
    )

    expect(queryByText('Admin Dashboard')).toBeNull()
    expect(queryByText('User Management')).toBeNull()
  })
})
