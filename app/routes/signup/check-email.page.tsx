import {
  Anchor,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconMail } from '@tabler/icons-react'
import { Link, useSearchParams } from 'react-router'
import { SIGNUP_MESSAGES } from '~/constants/messages'
import { ROUTES } from '~/constants/routes'
import { authClient } from '~/lib/auth-client'
import styles from './page.module.css'

export function meta() {
  return [
    { title: 'EV Station | Check your email' },
    {
      name: 'description',
      content: 'Verify your email to activate your EV Station account.',
    },
  ]
}

export default function SignupCheckEmailPage() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') ?? ''

  const handleResend = async () => {
    if (!email) return

    try {
      await authClient.sendVerificationEmail({
        email,
        callbackURL: ROUTES.LOGIN,
      })

      notifications.show({
        title: 'Email Sent',
        message: SIGNUP_MESSAGES.RESEND_SUCCESS,
        color: 'green',
      })
    } catch {
      notifications.show({
        title: 'Error',
        message: SIGNUP_MESSAGES.RESEND_FAIL,
        color: 'red',
      })
    }
  }

  return (
    <Box mih="100vh" pos="relative" className={styles.pageShell}>
      <Box aria-hidden className={styles.bgBlobTopLeft} />
      <Box aria-hidden className={styles.bgBlobTopRight} />

      <Container
        size="sm"
        py={{ base: 'lg', sm: '3xl', lg: '4xl' }}
        pos="relative"
        w="100%"
      >
        <Paper radius="xl" shadow="xl" withBorder className={styles.cardShell}>
          <Box className={styles.panel}>
            <Stack
              gap="xl"
              align="center"
              ta="center"
              className={styles.panelContent}
            >
              <ThemeIcon size={72} radius="xl" variant="light" color="teal">
                <IconMail size={36} />
              </ThemeIcon>

              <Stack gap="sm">
                <Title order={2} fw={900} fz={{ base: 28, sm: 36 }} lh={1.05}>
                  {SIGNUP_MESSAGES.CHECK_EMAIL_HEADING}
                </Title>
                <Text c="dimmed" lh={1.7}>
                  {SIGNUP_MESSAGES.CHECK_EMAIL_BODY}
                </Text>
                {email && (
                  <Text fw={600} c="teal.7">
                    {email}
                  </Text>
                )}
                <Text size="sm" c="dimmed">
                  {SIGNUP_MESSAGES.CHECK_EMAIL_SPAM}
                </Text>
              </Stack>

              {email && (
                <Button variant="outline" color="teal" onClick={handleResend}>
                  Resend verification email
                </Button>
              )}

              <Text size="sm" c="dimmed">
                Already verified?{' '}
                <Anchor component={Link} to={ROUTES.LOGIN} size="sm">
                  Sign in
                </Anchor>
              </Text>

              <Button
                component={Link}
                to={ROUTES.HOME}
                variant="subtle"
                size="sm"
              >
                Back to home
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}
