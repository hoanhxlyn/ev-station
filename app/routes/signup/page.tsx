import {
  Anchor,
  Box,
  Button,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { IconBolt } from '@tabler/icons-react'
import { Link } from 'react-router'
import styles from './page.module.css'

export function meta() {
  return [
    { title: 'EV Station | Sign Up' },
    {
      name: 'description',
      content: 'Create an account for the EV Station operator portal.',
    },
  ]
}

export default function Signup() {
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
          <Stack
            gap="xl"
            w="100%"
            flex={1}
            miw={0}
            className={styles.panelContent}
          >
            <Stack gap={8}>
              <Group gap="sm" className={styles.badge}>
                <ThemeIcon size={22} radius="xl" variant="light" color="teal">
                  <IconBolt size={12} />
                </ThemeIcon>
                <Text size="xs" fw={700} tt="uppercase" c="teal.7">
                  New operator signup
                </Text>
              </Group>
              <Title order={2} fw={900} fz={{ base: 28, sm: 36 }} lh={1.05}>
                Create your account
              </Title>
              <Text c="dimmed" lh={1.7}>
                Sign up for an EV Station operator account. This feature is
                coming soon.
              </Text>
            </Stack>

            <Group justify="center" gap={4}>
              <Text size="sm" c="dimmed">
                Already have an account?
              </Text>
              <Anchor component={Link} to="/login" size="sm">
                Sign in
              </Anchor>
            </Group>

            <Button
              component={Link}
              to="/"
              variant="subtle"
              size="sm"
              mx="auto"
            >
              Back to home
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}
