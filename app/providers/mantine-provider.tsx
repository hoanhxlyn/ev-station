import { MantineProvider } from '@mantine/core'
import { DatesProvider } from '@mantine/dates'
import { Notifications } from '@mantine/notifications'
import type { ReactNode } from 'react'
import { mantineTheme } from '../theme/mantine-theme'

export function MantineAppProvider({ children }: { children: ReactNode }) {
  return (
    <MantineProvider theme={mantineTheme} defaultColorScheme="light">
      <DatesProvider settings={{ locale: 'en' }}>
        <Notifications />
        {children}
      </DatesProvider>
    </MantineProvider>
  )
}
