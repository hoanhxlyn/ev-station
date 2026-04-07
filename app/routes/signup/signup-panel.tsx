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
import {
  IconAt,
  IconBolt,
  IconCalendar,
  IconLock,
  IconUser,
} from '@tabler/icons-react'
import dayjs from 'dayjs'
import { zodResolver } from 'mantine-form-zod-resolver'
import { Link, useFetcher, useLoaderData, useSearchParams } from 'react-router'
import { SIGNUP_MESSAGES } from '~/constants/messages'
import { ROUTES } from '~/constants/routes'
import {
  signupSchema,
  signupWithPasswordSchema,
  type SignupValues,
} from '~/schemas/auth'
import type { signupAction } from './actions'
import styles from './page.module.css'

type LoaderData = { email: string; name: string } | null

export function SignupPanel() {
  const [searchParams] = useSearchParams()
  const loaderData = useLoaderData<LoaderData>()
  const fetcher = useFetcher<typeof signupAction>()

  const oauthEmail = loaderData?.email ?? ''
  const oauthName = loaderData?.name ?? ''
  const email = searchParams.get('email') ?? oauthEmail
  const name = searchParams.get('name') ?? oauthName
  const isOAuthCompletion =
    Boolean(oauthEmail && oauthName) &&
    email === oauthEmail &&
    name === oauthName

  const form = useForm<SignupValues>({
    mode: 'uncontrolled',
    initialValues: {
      email,
      username: '',
      password: '',
      name,
      dateOfBirth: '',
    },
    validate: zodResolver(
      isOAuthCompletion ? signupSchema : signupWithPasswordSchema,
    ),
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
              leftSection={<IconAt size={16} />}
              leftSectionPointerEvents="none"
              withAsterisk
              name="email"
              key={form.key('email')}
              {...form.getInputProps('email')}
              readOnly={!!email}
            />
            <TextInput
              label="Username"
              placeholder="Choose a username"
              leftSection={<IconUser size={16} />}
              leftSectionPointerEvents="none"
              withAsterisk
              name="username"
              key={form.key('username')}
              {...form.getInputProps('username')}
            />
            <TextInput
              label="Full name"
              placeholder="Enter your full name"
              leftSection={<IconUser size={16} />}
              leftSectionPointerEvents="none"
              withAsterisk
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
                withAsterisk
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
              {...form.getInputProps('dateOfBirth', { type: 'input' })}
              value={
                form.getValues().dateOfBirth
                  ? dayjs(form.getValues().dateOfBirth).toDate()
                  : null
              }
              onChange={(date) =>
                form.setFieldValue(
                  'dateOfBirth',
                  date ? dayjs(date).format('YYYY-MM-DD') : '',
                )
              }
              valueFormat="DD/MM/YYYY"
              dateParser={(input) => dayjs(input, 'DD/MM/YYYY').toDate()}
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
