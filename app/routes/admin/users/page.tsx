import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Group,
  Pagination,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  ThemeIcon,
} from '@mantine/core'
import { IconSearch, IconUsers } from '@tabler/icons-react'
import { Link, useSearchParams } from 'react-router'
import { formatCurrency } from '~/lib/format-utils'
import styles from './page.module.css'
import type { Route } from './+types/page'

export { adminUsersLoader as loader } from './loader'

export function meta() {
  return [
    { title: 'EV Station | User Management' },
    {
      name: 'description',
      content: 'Admin user management for EV Station.',
    },
  ]
}

export default function AdminUsersPage({ loaderData }: Route.ComponentProps) {
  const { users, totalCount, page, pageSize, search, status } = loaderData
  const [searchParams, setSearchParams] = useSearchParams()
  const totalPages = Math.ceil(totalCount / pageSize)

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newSearch = formData.get('search')?.toString() || ''
    searchParams.set('search', newSearch)
    searchParams.set('page', '1')
    setSearchParams(searchParams)
  }

  const handleStatusChange = (value: string | null) => {
    if (value !== null) {
      searchParams.set('status', value)
      searchParams.set('page', '1')
      setSearchParams(searchParams)
    }
  }

  const handlePageChange = (newPage: number) => {
    searchParams.set('page', newPage.toString())
    setSearchParams(searchParams)
  }

  return (
    <Box className={styles.pageShell}>
      <Container size="xl" py="xl">
        <Group justify="space-between" align="center" mb="xl">
          <Group gap="sm">
            <ThemeIcon
              size={44}
              radius="xl"
              variant="gradient"
              gradient={{ from: 'red.5', to: 'orange.5', deg: 135 }}
            >
              <IconUsers size={22} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text fw={800} lh={1.1} size="lg">
                User Management
              </Text>
              <Text size="sm" c="dimmed">
                {totalCount} users total
              </Text>
            </Stack>
          </Group>
        </Group>

        <Card radius="xl" p="lg" withBorder shadow="sm" mb="xl">
          <Group justify="space-between" align="flex-end">
            <form onSubmit={handleSearch}>
              <Group gap="sm">
                <TextInput
                  placeholder="Search users..."
                  name="search"
                  defaultValue={search}
                  leftSection={<IconSearch size={16} />}
                  w={250}
                />
                <Button type="submit" variant="light">
                  Search
                </Button>
              </Group>
            </form>
            <Select
              value={status}
              onChange={handleStatusChange}
              data={[
                { value: 'all', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'locked', label: 'Locked' },
              ]}
              w={140}
            />
          </Group>
        </Card>

        <Card radius="xl" p="lg" withBorder shadow="sm">
          <Table.ScrollContainer minWidth={800}>
            <Table verticalSpacing="sm" highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Email</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Vehicles</Table.Th>
                  <Table.Th>Balance</Table.Th>
                  <Table.Th ta="right">Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {users.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={6}>
                      <Text c="dimmed" ta="center" py="md">
                        No users found
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  users.map((u) => (
                    <Table.Tr key={u.id}>
                      <Table.Td>
                        <Text fw={600} size="sm">
                          {u.name}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed">
                          {u.email}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          variant="light"
                          color={u.status === 'active' ? 'green' : 'red'}
                          radius="xl"
                        >
                          {u.status}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{u.vehicleCount}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">
                          {formatCurrency(u.creditBalance, 100)} credits
                        </Text>
                      </Table.Td>
                      <Table.Td ta="right">
                        <Button
                          component={Link}
                          to={`/admin/users/${u.id}`}
                          variant="subtle"
                          size="xs"
                        >
                          View Details
                        </Button>
                      </Table.Td>
                    </Table.Tr>
                  ))
                )}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>

          {totalPages > 1 && (
            <Group justify="center" mt="xl">
              <Pagination
                value={page}
                onChange={handlePageChange}
                total={totalPages}
              />
            </Group>
          )}
        </Card>
      </Container>
    </Box>
  )
}
