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
import '@mantine/notifications/styles.css'
import type { ReactNode } from 'react'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from 'react-router'
import type { Route } from './+types/root'
import './app.css'
import { MantineAppProvider } from './providers'
import styles from './root.module.css'

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

export default function App() {
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
              radius="lg"
              bg="gray.0"
              className={styles.errorStack}
            >
              <Text component="code" size="sm" ff="monospace">
                {stack}
              </Text>
            </Paper>
          )}
          <Button component="a" href="/" variant="light">
            Return home
          </Button>
        </Stack>
      </Paper>
    </Container>
  )
}
