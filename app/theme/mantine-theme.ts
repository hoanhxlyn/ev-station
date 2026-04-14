import { createTheme, type MantineThemeOverride } from '@mantine/core'

const defaultProps = {
  size: 'sm',
  radius: 'lg',
}

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
      defaultProps: defaultProps,
    },
    TextInput: {
      defaultProps: defaultProps,
    },
    NumberInput: {
      defaultProps: defaultProps,
    },
    DateInput: {
      defaultProps: defaultProps,
    },
    PasswordInput: {
      defaultProps: defaultProps,
    },
    Select: {
      defaultProps: defaultProps,
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
        shadow: 'sm',
        withBorder: true,
      },
    },
    Paper: {
      defaultProps: {
        shadow: 'sm',
      },
    },
    Modal: {
      defaultProps: {
        centered: true,
      },
    },
    ActionIcon: {
      defaultProps: {
        size: 'md',
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
