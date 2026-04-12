import { createTheme, type MantineThemeOverride } from '@mantine/core'

export const mantineTheme: MantineThemeOverride = createTheme({
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
  components: {
    Button: {
      defaultProps: {
        size: 'md',
        radius: 'lg',
      },
    },
    TextInput: {
      defaultProps: {
        size: 'md',
        radius: 'lg',
      },
    },
    NumberInput: {
      defaultProps: {
        size: 'md',
        radius: 'lg',
      },
    },
    Select: {
      defaultProps: {
        size: 'md',
        radius: 'lg',
      },
    },
    Table: {
      defaultProps: {
        highlightOnHover: true,
        withTableBorder: true,
        withColumnBorders: true,
      },
    },
    Card: {
      defaultProps: {
        radius: 'lg',
        shadow: 'sm',
        withBorder: true,
      },
    },
    Paper: {
      defaultProps: {
        radius: 'lg',
        shadow: 'sm',
      },
    },
    Modal: {
      defaultProps: {
        radius: 'lg',
        centered: true,
      },
    },
    ActionIcon: {
      defaultProps: {
        size: 'md',
        radius: 'lg',
        variant: 'subtle',
      },
    },
    Pagination: {
      defaultProps: {
        size: 'md',
      },
    },
  },
})
