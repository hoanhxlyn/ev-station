import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import type { ReactNode } from 'react'
import { mantineTheme } from '../theme/mantine-theme'

export function MantineAppProvider({ children }: { children: ReactNode }) {
  return (
    <MantineProvider theme={mantineTheme} defaultColorScheme="light">
      <Notifications />
      {children}
    </MantineProvider>
  )
}
