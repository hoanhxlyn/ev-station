import {
  Anchor,
  Box,
  Button,
  Checkbox,
  Divider,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { zodResolver } from 'mantine-form-zod-resolver'
import {
  IconBolt,
  IconBrandGithub,
  IconLock,
  IconUser,
} from '@tabler/icons-react'
import { Link, useFetcher } from 'react-router'
import { ROUTES } from '~/constants/routes'
import { authClient } from '~/lib/auth-client'
import { loginSchema, type LoginValues } from '~/schemas/auth'
import type { loginAction } from './actions'
import styles from './page.module.css'

export function LoginRightPanel() {
  const fetcher = useFetcher<typeof loginAction>()

  const form = useForm<LoginValues>({
    mode: 'uncontrolled',
    initialValues: { accountName: '', password: '', remember: false },
    validate: zodResolver(loginSchema),
    validateInputOnBlur: true,
  })

  const isLoading = fetcher.state !== 'idle'

  return (
    <Box className={styles.rightPanel}>
      <Stack
        gap="xl"
        w="100%"
        flex={1}
        miw={0}
        className={styles.rightPanelContent}
      >
        <Stack gap={8}>
          <Group hiddenFrom="lg" gap="sm" className={styles.mobileBrand}>
            <ThemeIcon size={40} radius="xl" variant="light" color="teal">
              <IconBolt size={20} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text fw={800} size="lg" lh={1.1}>
                EV Station
              </Text>
              <Text size="sm" c="dimmed">
                Operator access portal
              </Text>
            </Stack>
          </Group>
          <BadgeRow />
          <Title order={2} fw={900} fz={{ base: 32, sm: 40 }} lh={1.05}>
            Sign in to your EV Station account
          </Title>
          <Text c="dimmed" lh={1.7}>
            Use your operator account to manage stations, vehicles, and charging
            activity.
          </Text>
        </Stack>

        <fetcher.Form
          method="post"
          autoComplete="off"
          onSubmit={(event) => {
            event.preventDefault()
            const validation = form.validate()
            if (validation.hasErrors) return
            fetcher.submit(event.currentTarget)
          }}
        >
          <Stack gap="md">
            <TextInput
              label="Account name"
              placeholder="Enter your account name"
              leftSection={<IconUser size={16} />}
              leftSectionPointerEvents="none"
              withAsterisk
              name="accountName"
              key={form.key('accountName')}
              {...form.getInputProps('accountName')}
            />
            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              leftSection={<IconLock size={16} />}
              leftSectionPointerEvents="none"
              withAsterisk
              name="password"
              key={form.key('password')}
              {...form.getInputProps('password')}
            />
            <Group justify="space-between" align="center">
              <Checkbox
                label="Remember me"
                name="remember"
                key={form.key('remember')}
                {...form.getInputProps('remember', { type: 'checkbox' })}
              />
              <Anchor href="#" size="sm">
                Forgot password?
              </Anchor>
            </Group>

            <Button type="submit" fullWidth loading={isLoading}>
              Sign in
            </Button>
          </Stack>
        </fetcher.Form>

        <Divider label="Or connect with social links" labelPosition="center" />

        <SimpleSocialLinks />

        <Group justify="center" gap={4}>
          <Text size="sm" c="dimmed">
            Don&apos;t have an account?
          </Text>
          <Anchor component={Link} to={ROUTES.SIGNUP} size="sm">
            Sign up
          </Anchor>
        </Group>

        <Button
          component={Link}
          to={ROUTES.HOME}
          variant="subtle"
          size="sm"
          mx="auto"
        >
          Back to home
        </Button>
      </Stack>
    </Box>
  )
}

function BadgeRow() {
  return (
    <Group gap="xs" w="fit-content" px="sm" py={6} className={styles.badgeRow}>
      <ThemeIcon size={22} radius="xl" variant="light" color="teal">
        <IconBolt size={12} />
      </ThemeIcon>
      <Text size="xs" fw={700} tt="uppercase" c="teal.7">
        Secure operator login
      </Text>
    </Group>
  )
}

function SimpleSocialLinks() {
  const handleGitHubSignIn = async () => {
    await authClient.signIn.social({
      provider: 'github',
      callbackURL: ROUTES.APP,
    })
  }

  return (
    <Button
      variant="default"
      leftSection={<IconBrandGithub size={18} />}
      onClick={handleGitHubSignIn}
      fullWidth
    >
      Sign in with GitHub
    </Button>
  )
}
