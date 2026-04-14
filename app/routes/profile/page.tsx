import {
  Box,
  Button,
  Card,
  Container,
  Group,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { zodResolver } from 'mantine-form-zod-resolver'
import { IconPhone, IconPhoto, IconUser } from '@tabler/icons-react'
import { useFetcher } from 'react-router'
import {
  updateProfileIntent,
  type UpdateProfileValues,
} from '~/schemas/profile'
import styles from './page.module.css'
import type { Route } from './+types/page'

export { profileLoader as loader } from './loader'
export { profileAction as action } from './actions'

export function meta() {
  return [
    { title: 'EV Station | Profile' },
    {
      name: 'description',
      content: 'Manage your EV Station profile.',
    },
  ]
}

export default function ProfilePage({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData
  const fetcher = useFetcher()
  const isLoading = fetcher.state !== 'idle'

  const form = useForm<UpdateProfileValues>({
    mode: 'uncontrolled',
    initialValues: {
      intent: 'update',
      name: user.name ?? '',
      phone: user.phone ?? '',
      image: user.image ?? '',
    },
    validate: zodResolver(updateProfileIntent),
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const validation = form.validate()
    if (validation.hasErrors) return
    fetcher.submit(event.currentTarget)
  }

  return (
    <Box className={styles.pageShell}>
      <Container size="md" py="xl">
        <Group gap="sm" mb="xl">
          <ThemeIcon
            size={44}
            radius="xl"
            variant="gradient"
            gradient={{ from: 'teal.5', to: 'cyan.5', deg: 135 }}
          >
            <IconUser size={22} />
          </ThemeIcon>
          <Stack gap={0}>
            <Text fw={800} lh={1.1} size="lg">
              Profile
            </Text>
            <Text size="sm" c="dimmed">
              Manage your account settings
            </Text>
          </Stack>
        </Group>

        <Card radius="xl" p="lg" withBorder shadow="sm" mb="xl">
          <Text fw={700} fz="lg" mb="md">
            Account Information
          </Text>
          <Stack gap="sm">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Email
              </Text>
              <Text size="sm" fw={500}>
                {user.email}
              </Text>
            </Group>
            {user.username && (
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Username
                </Text>
                <Text size="sm" fw={500}>
                  @{user.username}
                </Text>
              </Group>
            )}
          </Stack>
        </Card>

        <Card radius="xl" p="lg" withBorder shadow="sm">
          <Text fw={700} fz="lg" mb="md">
            Edit Profile
          </Text>

          <fetcher.Form
            method="post"
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <input type="hidden" name="intent" value="update" />
            <Stack gap="md">
              <TextInput
                label="Name"
                placeholder="Your full name"
                leftSection={<IconUser size={16} />}
                leftSectionPointerEvents="none"
                withAsterisk
                name="name"
                key={form.key('name')}
                {...form.getInputProps('name')}
              />
              <TextInput
                label="Phone"
                placeholder="Your phone number"
                leftSection={<IconPhone size={16} />}
                leftSectionPointerEvents="none"
                name="phone"
                key={form.key('phone')}
                {...form.getInputProps('phone')}
              />
              <TextInput
                label="Avatar URL"
                placeholder="Link to your avatar image"
                leftSection={<IconPhoto size={16} />}
                leftSectionPointerEvents="none"
                name="image"
                key={form.key('image')}
                {...form.getInputProps('image')}
              />

              <Button type="submit" loading={isLoading} mt="sm">
                Save Changes
              </Button>
            </Stack>
          </fetcher.Form>
        </Card>
      </Container>
    </Box>
  )
}
