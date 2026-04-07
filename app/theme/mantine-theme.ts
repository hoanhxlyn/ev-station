import { createTheme } from '@mantine/core'

export const mantineTheme = createTheme({
  primaryColor: 'teal',
  defaultRadius: 'lg',
  fontFamily: '"Roboto Variable", sans-serif',
  headings: {
    fontFamily: '"Roboto Variable", sans-serif',
  },
  spacing: {
    '2xl': '2.5rem', // 40px — large section padding
    '3xl': '2rem', // 32px — medium page padding
    '4xl': '3rem', // 48px — large page padding
  },
})
