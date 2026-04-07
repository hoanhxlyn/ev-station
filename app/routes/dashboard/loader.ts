import { redirect } from 'react-router'
import { auth } from '~/lib/auth.server'
import { ROUTES } from '~/constants/routes'
import {
  MOCK_CHARGING_DATA,
  MOCK_CREDIT,
  MOCK_RECENT_STATIONS,
} from '~/constants/dashboard'
import type { Route } from './+types/page'

export async function dashboardLoader({ request }: Route.LoaderArgs) {
  const session = await auth.api.getSession({ headers: request.headers })

  if (!session?.user) {
    throw redirect(ROUTES.LOGIN)
  }

  return {
    user: {
      name: session.user.name,
      email: session.user.email,
    },
    chargingData: MOCK_CHARGING_DATA,
    credit: MOCK_CREDIT,
    recentStations: MOCK_RECENT_STATIONS,
  }
}
