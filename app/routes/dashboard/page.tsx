import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Group,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { AreaChart } from '@mantine/charts'
import {
  IconBolt,
  IconCreditCard,
  IconMapPin,
  IconClock,
} from '@tabler/icons-react'
import { Link, useSearchParams } from 'react-router'
import { DASHBOARD_MESSAGES } from '~/constants/dashboard'
import { ROUTES } from '~/constants/routes'
import { formatCurrency } from '~/lib/format-utils'
import styles from './page.module.css'
import type { Route } from './+types/page'

export { dashboardLoader as loader } from './loader'

export function meta() {
  return [
    { title: 'EV Station | Dashboard' },
    {
      name: 'description',
      content: 'Your personalized EV charging dashboard.',
    },
  ]
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const {
    user,
    activeSession,
    recentSessions,
    totalTopUp,
    aggregatedData,
    period,
    creditUnit,
  } = loaderData
  const [searchParams, setSearchParams] = useSearchParams()

  const handlePeriodChange = (value: string | null) => {
    if (value) {
      searchParams.set('period', value)
      setSearchParams(searchParams)
    }
  }

  const chartData = aggregatedData.map((d) => ({
    date: d.date,
    transactions: d.transactions,
    amount: Number(d.amount ?? 0),
  }))

  return (
    <Box className={styles.pageShell}>
      <Box aria-hidden className={styles.bgBlobTopLeft} />
      <Box aria-hidden className={styles.bgBlobBottomRight} />

      <Container size="xl" py="xl" pos="relative">
        <Group justify="space-between" align="center" mb="xl">
          <Group gap="sm">
            <ThemeIcon
              size={44}
              radius="xl"
              variant="gradient"
              gradient={{ from: 'teal.5', to: 'cyan.5', deg: 135 }}
            >
              <IconBolt size={22} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text fw={800} lh={1.1} size="lg">
                EV Station
              </Text>
              <Text size="sm" c="dimmed">
                {DASHBOARD_MESSAGES.TITLE}
              </Text>
            </Stack>
          </Group>

          <Badge variant="light" color="teal" radius="xl" visibleFrom="sm">
            {user.email}
          </Badge>
        </Group>

        <Title order={2} fw={900} mb="sm">
          {DASHBOARD_MESSAGES.WELCOME}, {user.name ?? 'there'}
        </Title>
        <Text c="dimmed" mb="xl">
          Here&apos;s your charging activity overview.
        </Text>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg" mb="lg">
          <Card radius="xl" p="lg" withBorder shadow="sm">
            <Group justify="space-between" align="flex-start" mb="md">
              <Stack gap={2}>
                <Text c="dimmed" size="sm">
                  {DASHBOARD_MESSAGES.CREDIT_TITLE}
                </Text>
                <Title order={3}>
                  {formatCurrency(user.creditBalance, creditUnit.DIVISOR)}{' '}
                  {creditUnit.LABEL}
                </Title>
              </Stack>
              <ThemeIcon size={42} radius="xl" variant="light" color="teal">
                <IconCreditCard size={20} />
              </ThemeIcon>
            </Group>
            <Button
              component={Link}
              to={ROUTES.WALLET}
              variant="light"
              fullWidth
            >
              Top up
            </Button>
          </Card>

          <Card radius="xl" p="lg" withBorder shadow="sm">
            <Group justify="space-between" align="flex-start" mb="md">
              <Stack gap={2}>
                <Text c="dimmed" size="sm">
                  Total Top-up
                </Text>
                <Title order={3}>
                  {formatCurrency(totalTopUp, creditUnit.DIVISOR)}{' '}
                  {creditUnit.LABEL}
                </Title>
              </Stack>
              <ThemeIcon size={42} radius="xl" variant="light" color="blue">
                <IconCreditCard size={20} />
              </ThemeIcon>
            </Group>
          </Card>

          <Card radius="xl" p="lg" withBorder shadow="sm">
            <Group justify="space-between" align="flex-start" mb="md">
              <Stack gap={2}>
                <Text c="dimmed" size="sm">
                  Active Session
                </Text>
                <Title order={3}>
                  {activeSession ? (
                    <Badge color="teal" variant="light" size="lg">
                      {activeSession.station.name}
                    </Badge>
                  ) : (
                    'None'
                  )}
                </Title>
              </Stack>
              <ThemeIcon size={42} radius="xl" variant="light" color="orange">
                <IconBolt size={20} />
              </ThemeIcon>
            </Group>
            <Button
              component={Link}
              to={ROUTES.CHARGING}
              variant="light"
              fullWidth
            >
              {activeSession ? 'Manage Session' : 'Start Charging'}
            </Button>
          </Card>

          <Card radius="xl" p="lg" withBorder shadow="sm">
            <Group justify="space-between" align="flex-start" mb="md">
              <Stack gap={2}>
                <Text c="dimmed" size="sm">
                  Recent Sessions
                </Text>
                <Title order={3}>{recentSessions.length}</Title>
              </Stack>
              <ThemeIcon size={42} radius="xl" variant="light" color="grape">
                <IconClock size={20} />
              </ThemeIcon>
            </Group>
          </Card>
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" mb="lg">
          <Card radius="xl" p="lg" withBorder shadow="sm">
            <Group justify="space-between" align="flex-start" mb="md">
              <Stack gap={2}>
                <Text fw={700} fz="lg">
                  Activity Chart
                </Text>
                <Text c="dimmed" size="sm">
                  Transaction activity
                </Text>
              </Stack>
              <Select
                value={period}
                onChange={handlePeriodChange}
                data={[
                  { value: 'day', label: 'Today' },
                  { value: 'week', label: 'Last 7 days' },
                  { value: 'month', label: 'Last 30 days' },
                  { value: 'year', label: 'Last year' },
                ]}
                w={140}
                size="sm"
              />
            </Group>

            <AreaChart
              h={220}
              data={chartData}
              dataKey="date"
              series={[{ name: 'transactions', color: 'teal.6' }]}
              curveType="monotone"
              gridAxis="y"
              tickLine="none"
            />
          </Card>

          <Card radius="xl" p="lg" withBorder shadow="sm">
            <Group justify="space-between" align="flex-start" mb="md">
              <Stack gap={2}>
                <Text fw={700} fz="lg">
                  Amount by Date
                </Text>
                <Text c="dimmed" size="sm">
                  Transaction amounts
                </Text>
              </Stack>
            </Group>

            <AreaChart
              h={220}
              data={chartData}
              dataKey="date"
              series={[{ name: 'amount', color: 'blue.6' }]}
              curveType="monotone"
              gridAxis="y"
              tickLine="none"
            />
          </Card>
        </SimpleGrid>

        <Card radius="xl" p="lg" withBorder shadow="sm">
          <Group justify="space-between" align="flex-start" mb="md">
            <Stack gap={2}>
              <Text fw={700} fz="lg">
                Recent Charging Sessions
              </Text>
              <Text c="dimmed" size="sm">
                Your latest charging activity
              </Text>
            </Stack>
            <ThemeIcon size={42} radius="xl" variant="light" color="teal">
              <IconMapPin size={20} />
            </ThemeIcon>
          </Group>

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
                {recentSessions.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={5}>
                      <Text c="dimmed" ta="center" py="md">
                        No charging sessions yet
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  recentSessions.map((session) => (
                    <Table.Tr key={session.id}>
                      <Table.Td>
                        <Stack gap={2}>
                          <Text fw={600} size="sm">
                            {session.station.name}
                          </Text>
                          <Text c="dimmed" size="xs">
                            {session.station.location}
                          </Text>
                        </Stack>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">
                          {session.vehicle.brand} {session.vehicle.model}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          variant="light"
                          color={
                            session.status === 'in-progress'
                              ? 'teal'
                              : session.status === 'completed'
                                ? 'blue'
                                : 'gray'
                          }
                          radius="xl"
                        >
                          {session.status}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        {session.energyConsumed != null
                          ? `${(session.energyConsumed / 1000).toFixed(2)} kWh`
                          : '-'}
                      </Table.Td>
                      <Table.Td ta="right">
                        <Text fw={600} size="sm">
                          {session.cost != null
                            ? `${formatCurrency(session.cost, creditUnit.DIVISOR)} ${creditUnit.LABEL}`
                            : '-'}
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  ))
                )}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Card>
      </Container>
    </Box>
  )
}
