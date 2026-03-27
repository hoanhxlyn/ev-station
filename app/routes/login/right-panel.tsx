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
import {
  IconBolt,
  IconBrandGithub,
  IconBrandGoogle,
  IconLock,
  IconUser,
} from '@tabler/icons-react'
import { Link } from 'react-router'
import styles from './page.module.css'

export function LoginRightPanel() {
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

        <Box component="form" onSubmit={(event) => event.preventDefault()}>
          <Stack gap="md">
            <TextInput
              label="Account name"
              placeholder="Enter your account name"
              leftSection={<IconUser size={16} />}
              leftSectionPointerEvents="none"
              radius="lg"
              size="md"
              required
            />
            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              leftSection={<IconLock size={16} />}
              leftSectionPointerEvents="none"
              radius="lg"
              size="md"
              required
            />
            <Group justify="space-between" align="center">
              <Checkbox label="Remember me" radius="md" />
              <Anchor href="#" size="sm">
                Forgot password?
              </Anchor>
            </Group>

            <Button size="md" radius="lg" type="submit" fullWidth>
              Sign in
            </Button>
          </Stack>
        </Box>

        <Divider label="Or connect with social links" labelPosition="center" />

        <SimpleSocialLinks />

        <Button
          component={Link}
          to="/"
          variant="subtle"
          radius="lg"
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
  return (
    <Group grow>
      <Button
        component="a"
        href="#"
        variant="default"
        radius="lg"
        leftSection={<IconBrandGoogle size={18} />}
      >
        Google
      </Button>
      <Button
        component="a"
        href="#"
        variant="default"
        radius="lg"
        leftSection={<IconBrandGithub size={18} />}
      >
        GitHub
      </Button>
    </Group>
  )
}
