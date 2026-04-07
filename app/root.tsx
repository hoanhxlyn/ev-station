import {
  Button,
  ColorSchemeScript,
  Container,
  Paper,
  Stack,
  Text,
  Title,
  mantineHtmlProps,
} from '@mantine/core'
import '@fontsource-variable/roboto/wght.css'
import '@mantine/core/styles.css'
import '@mantine/carousel/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/notifications/styles.css'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import 'dayjs/locale/en-gb'
import { notifications } from '@mantine/notifications'
import { useEffect, type ReactNode } from 'react'
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  data,
  isRouteErrorResponse,
} from 'react-router'
import { getToast } from 'remix-toast'
import type { Route } from './+types/root'
import './app.css'
import { ROUTES } from './constants/routes'
import { MantineAppProvider } from './providers'
import styles from './root.module.css'

dayjs.extend(customParseFormat)
dayjs.extend(localizedFormat)
dayjs.locale('en-gb')

export async function loader({ request }: Route.LoaderArgs) {
  const { toast, headers } = await getToast(request)
  return data({ toast }, { headers })
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <ColorSchemeScript defaultColorScheme="light" />
        <Meta />
        <Links />
      </head>
      <body>
        <MantineAppProvider>{children}</MantineAppProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App({ loaderData }: Route.ComponentProps) {
  const { toast } = loaderData

  useEffect(() => {
    if (toast) {
      notifications.show({
        title: toast.type === 'success' ? 'Success' : 'Error',
        message: toast.message,
        color: toast.type === 'success' ? 'green' : 'red',
      })
    }
  }, [toast])

  return <Outlet />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error'
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <Container size="sm" py="xl">
      <Paper radius="xl" p="xl" shadow="sm" withBorder>
        <Stack gap="md">
          <Title order={1}>{message}</Title>
          <Text c="dimmed">{details}</Text>
          {stack && (
            <Paper
              component="pre"
              p="md"
              bg="gray.0"
              className={styles.errorStack}
            >
              <Text component="code" size="sm" ff="monospace">
                {stack}
              </Text>
            </Paper>
          )}
          <Button component={Link} to={ROUTES.HOME} variant="light">
            Return home
          </Button>
        </Stack>
      </Paper>
    </Container>
  )
}
