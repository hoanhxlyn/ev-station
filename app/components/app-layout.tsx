import { AppShell } from '@mantine/core'
import { Outlet, useRouteLoaderData } from 'react-router'
import { AppSidebar } from '~/components/app-sidebar'
import { auth } from '~/lib/auth.server'

export async function loader({ request }: { request: Request }) {
  const session = await auth.api.getSession({ headers: request.headers })
  return { user: { role: (session?.user as Record<string, unknown>)?.role } }
}

export function AppLayout() {
  const data = useRouteLoaderData('components/app-layout') as {
    user?: { role?: string }
  } | null
  const isAdmin = data?.user?.role === 'admin'

  return (
    <AppShell layout="default" navbar={{ width: 260, breakpoint: 'sm' }}>
      <AppSidebar isAdmin={isAdmin} />
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
