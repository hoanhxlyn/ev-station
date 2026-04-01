import {
  Anchor,
  Box,
  Button,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { IconBolt, IconCalendar, IconLock, IconUser } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { zodResolver } from 'mantine-form-zod-resolver'
import { Link, useFetcher, useSearchParams } from 'react-router'
import { SIGNUP_MESSAGES } from '~/constants/messages'
import { ROUTES } from '~/constants/routes'
import {
  signupSchema,
  signupWithPasswordSchema,
  type SignupValues,
} from '~/schemas/auth'
import type { signupAction } from './actions'
import styles from './page.module.css'

export function SignupPanel() {
  const [searchParams] = useSearchParams()
  const fetcher = useFetcher<typeof signupAction>()

  const email = searchParams.get('email') ?? ''
  const name = searchParams.get('name') ?? ''
  const isOAuthCompletion = Boolean(email && name)

  const form = useForm<SignupValues>({
    mode: 'uncontrolled',
    initialValues: {
      email,
      password: '',
      name,
      dateOfBirth: '',
    },
    validate: zodResolver(
      isOAuthCompletion ? signupSchema : signupWithPasswordSchema,
    ),
    validateInputOnBlur: true,
  })

  const isLoading = fetcher.state !== 'idle'

  return (
    <Box className={styles.panel}>
      <Stack gap="xl" w="100%" flex={1} miw={0} className={styles.panelContent}>
        <Stack gap={8}>
          <Group gap="sm" className={styles.badge}>
            <ThemeIcon size={22} radius="xl" variant="light" color="teal">
              <IconBolt size={12} />
            </ThemeIcon>
            <Text size="xs" fw={700} tt="uppercase" c="teal.7">
              New operator setup
            </Text>
          </Group>
          <Title order={2} fw={900} fz={{ base: 28, sm: 36 }} lh={1.05}>
            Complete your profile
          </Title>
          <Text c="dimmed" lh={1.7}>
            {SIGNUP_MESSAGES.COMPLETE_PROFILE}
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
          <input
            type="hidden"
            name="signupMode"
            value={isOAuthCompletion ? 'oauth' : 'password'}
          />

          <Stack gap="md">
            <TextInput
              label="Email"
              placeholder="Your email address"
              leftSection={<IconUser size={16} />}
              leftSectionPointerEvents="none"
              name="email"
              key={form.key('email')}
              {...form.getInputProps('email')}
              readOnly={!!email}
            />
            <TextInput
              label="Full name"
              placeholder="Enter your full name"
              leftSection={<IconUser size={16} />}
              leftSectionPointerEvents="none"
              name="name"
              key={form.key('name')}
              {...form.getInputProps('name')}
              readOnly={!!name}
            />
            {!isOAuthCompletion && (
              <PasswordInput
                label="Password"
                placeholder="Create your password"
                leftSection={<IconLock size={16} />}
                leftSectionPointerEvents="none"
                name="password"
                key={form.key('password')}
                {...form.getInputProps('password')}
              />
            )}
            <DateInput
              label="Date of birth"
              placeholder="Select your date of birth"
              leftSection={<IconCalendar size={16} />}
              leftSectionPointerEvents="none"
              name="dateOfBirth"
              key={form.key('dateOfBirth')}
              {...form.getInputProps('dateOfBirth')}
              valueFormat="L"
              dateParser={(input) => dayjs(input, 'L').toDate()}
              clearable
              maxDate={dayjs().toDate()}
            />

            <Button type="submit" fullWidth loading={isLoading}>
              Complete profile
            </Button>
          </Stack>
        </fetcher.Form>

        <Group justify="center" gap={4}>
          <Text size="sm" c="dimmed">
            Already have an account?
          </Text>
          <Anchor component={Link} to={ROUTES.LOGIN} size="sm">
            Sign in
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
