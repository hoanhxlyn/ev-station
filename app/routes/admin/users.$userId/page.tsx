import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Group,
  Modal,
  SimpleGrid,
  Stack,
  Table,
  Text,
  ThemeIcon,
} from '@mantine/core'
import {
  IconArrowLeft,
  IconLock,
  IconLockOpen,
  IconUser,
} from '@tabler/icons-react'
import { Link, useFetcher } from 'react-router'
import { useState } from 'react'
import { formatCurrency, formatDateShort } from '~/lib/format-utils'
import styles from './page.module.css'
import type { Route } from './+types/page'

export { adminUserDetailLoader as loader } from './loader'
export { adminUserDetailAction as action } from './actions'

export function meta() {
  return [
    { title: 'EV Station | User Detail' },
    {
      name: 'description',
      content: 'Admin user detail view for EV Station.',
    },
  ]
}

export default function AdminUserDetailPage({
  loaderData,
}: Route.ComponentProps) {
  const { userData, vehicles, transactions, sessions } = loaderData
  const fetcher = useFetcher()
  const [lockModalOpen, setLockModalOpen] = useState(false)
  const isLoading = fetcher.state !== 'idle'

  const handleToggleLock = () => {
    fetcher.submit(
      { intent: 'toggle-lock', userId: userData.id },
      { method: 'post' },
    )
    setLockModalOpen(false)
  }

  return (
    <Box className={styles.pageShell}>
      <Container size="xl" py="xl">
        <Group gap="sm" mb="xl">
          <Button
            component={Link}
            to="/admin/users"
            variant="subtle"
            leftSection={<IconArrowLeft size={18} />}
          >
            Back to Users
          </Button>
        </Group>

        <Group justify="space-between" align="center" mb="xl">
          <Group gap="sm">
            <ThemeIcon
              size={44}
              radius="xl"
              variant="gradient"
              gradient={{ from: 'red.5', to: 'orange.5', deg: 135 }}
            >
              <IconUser size={22} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text fw={800} lh={1.1} size="lg">
                {userData.name}
              </Text>
              <Text size="sm" c="dimmed">
                User Detail
              </Text>
            </Stack>
          </Group>
          <Button
            color={userData.status === 'active' ? 'red' : 'green'}
            leftSection={
              userData.status === 'active' ? (
                <IconLock size={18} />
              ) : (
                <IconLockOpen size={18} />
              )
            }
            onClick={() => setLockModalOpen(true)}
          >
            {userData.status === 'active' ? 'Lock Account' : 'Unlock Account'}
          </Button>
        </Group>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" mb="xl">
          <Card radius="xl" p="lg" withBorder shadow="sm">
            <Text fw={700} fz="lg" mb="md">
              Profile
            </Text>
            <Stack gap="sm">
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Name
                </Text>
                <Text size="sm" fw={500}>
                  {userData.name}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Email
                </Text>
                <Text size="sm" fw={500}>
                  {userData.email}
                </Text>
              </Group>
              {userData.username && (
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">
                    Username
                  </Text>
                  <Text size="sm" fw={500}>
                    @{userData.username}
                  </Text>
                </Group>
              )}
              {userData.phone && (
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">
                    Phone
                  </Text>
                  <Text size="sm" fw={500}>
                    {userData.phone}
                  </Text>
                </Group>
              )}
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Status
                </Text>
                <Badge
                  variant="light"
                  color={userData.status === 'active' ? 'green' : 'red'}
                  radius="xl"
                >
                  {userData.status}
                </Badge>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Balance
                </Text>
                <Text size="sm" fw={500}>
                  {formatCurrency(userData.creditBalance, 100)} credits
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Joined
                </Text>
                <Text size="sm" fw={500}>
                  {formatDateShort(userData.createdAt.getTime())}
                </Text>
              </Group>
            </Stack>
          </Card>

          <Card radius="xl" p="lg" withBorder shadow="sm">
            <Text fw={700} fz="lg" mb="md">
              Vehicles ({vehicles.length})
            </Text>
            {vehicles.length === 0 ? (
              <Text c="dimmed" size="sm">
                No vehicles
              </Text>
            ) : (
              <Stack gap="xs">
                {vehicles.map((v) => (
                  <Group key={v.id} justify="space-between">
                    <Text size="sm">
                      {v.brand} {v.model}
                    </Text>
                    <Badge variant="light" radius="xl">
                      {v.licensePlate}
                    </Badge>
                  </Group>
                ))}
              </Stack>
            )}
          </Card>
        </SimpleGrid>

        <Card radius="xl" p="lg" withBorder shadow="sm" mb="xl">
          <Text fw={700} fz="lg" mb="md">
            Recent Transactions
          </Text>
          <Table.ScrollContainer minWidth={600}>
            <Table verticalSpacing="sm" highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Type</Table.Th>
                  <Table.Th>Description</Table.Th>
                  <Table.Th>Date</Table.Th>
                  <Table.Th ta="right">Amount</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {transactions.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={4}>
                      <Text c="dimmed" ta="center" py="md">
                        No transactions
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  transactions.map((tx) => (
                    <Table.Tr key={tx.id}>
                      <Table.Td>
                        <Badge variant="light" radius="xl">
                          {tx.type}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{tx.description || '-'}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed">
                          {formatDateShort(tx.createdAt.getTime())}
                        </Text>
                      </Table.Td>
                      <Table.Td ta="right">
                        <Text
                          fw={600}
                          size="sm"
                          c={tx.amount > 0 ? 'green.7' : 'red.7'}
                        >
                          {tx.amount > 0 ? '+' : ''}
                          {formatCurrency(tx.amount, 100)} credits
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  ))
                )}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Card>

        <Card radius="xl" p="lg" withBorder shadow="sm">
          <Text fw={700} fz="lg" mb="md">
            Recent Charging Sessions
          </Text>
          <Table.ScrollContainer minWidth={600}>
            <Table verticalSpacing="sm" highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Station</Table.Th>
                  <Table.Th>Vehicle</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Energy</Table.Th>
                  <Table.Th ta="right">Cost</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {sessions.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={5}>
                      <Text c="dimmed" ta="center" py="md">
                        No charging sessions
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  sessions.map((s) => (
                    <Table.Tr key={s.id}>
                      <Table.Td>
                        <Text size="sm">{s.station.name}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">
                          {s.vehicle.brand} {s.vehicle.model}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          variant="light"
                          color={
                            s.status === 'in-progress'
                              ? 'teal'
                              : s.status === 'completed'
                                ? 'blue'
                                : 'gray'
                          }
                          radius="xl"
                        >
                          {s.status}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        {s.energyConsumed != null
                          ? `${(s.energyConsumed / 1000).toFixed(2)} kWh`
                          : '-'}
                      </Table.Td>
                      <Table.Td ta="right">
                        {s.cost != null
                          ? `${formatCurrency(s.cost, 100)} credits`
                          : '-'}
                      </Table.Td>
                    </Table.Tr>
                  ))
                )}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Card>
      </Container>

      <Modal
        opened={lockModalOpen}
        onClose={() => setLockModalOpen(false)}
        title={userData.status === 'active' ? 'Lock Account' : 'Unlock Account'}
        radius="lg"
      >
        <Stack gap="md">
          <Text>
            {userData.status === 'active'
              ? `Are you sure you want to lock ${userData.name}'s account? This will cancel any active charging sessions.`
              : `Are you sure you want to unlock ${userData.name}'s account?`}
          </Text>
          <Group justify="flex-end" gap="sm">
            <Button variant="outline" onClick={() => setLockModalOpen(false)}>
              Cancel
            </Button>
            <Button
              color={userData.status === 'active' ? 'red' : 'green'}
              onClick={handleToggleLock}
              loading={isLoading}
            >
              {userData.status === 'active' ? 'Lock' : 'Unlock'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  )
}
