import { auth } from '~/lib/auth.server'
import type { Route } from './+types/page'

export async function loader({ request }: Route.LoaderArgs) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session?.user) {
    return null
  }

  return {
    email: session.user.email ?? '',
    name: session.user.name ?? '',
  }
}
