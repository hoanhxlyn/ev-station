import {
  Box,
  Card,
  Container,
  Group,
  Select,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { AreaChart } from '@mantine/charts'
import {
  IconBolt,
  IconCreditCard,
  IconMapPin,
  IconUsers,
} from '@tabler/icons-react'
import { useSearchParams } from 'react-router'
import styles from './page.module.css'
import type { Route } from './+types/page'

export { adminLoader as loader } from './loader'

export function meta() {
  return [
    { title: 'EV Station | Admin Dashboard' },
    {
      name: 'description',
      content: 'Admin dashboard for EV Station management.',
    },
  ]
}

export default function AdminPage({ loaderData }: Route.ComponentProps) {
  const { totalUsers, totalStations, dailyTransactions, cashFlowData, period } =
    loaderData
  const [searchParams, setSearchParams] = useSearchParams()

  const handlePeriodChange = (value: string | null) => {
    if (value) {
      searchParams.set('period', value)
      setSearchParams(searchParams)
    }
  }

  const chartData = cashFlowData.map((d) => ({
    date: d.date,
    topUps: Number(d.topUps ?? 0),
    payments: Number(d.payments ?? 0),
  }))

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
              <IconBolt size={22} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text fw={800} lh={1.1} size="lg">
                Admin Dashboard
              </Text>
              <Text size="sm" c="dimmed">
                System overview
              </Text>
            </Stack>
          </Group>
          <Select
            value={period}
            onChange={handlePeriodChange}
            data={[
              { value: 'week', label: 'Last 7 days' },
              { value: 'month', label: 'Last 30 days' },
              { value: 'year', label: 'Last year' },
            ]}
            w={160}
            size="sm"
          />
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" mb="xl">
          <Card radius="xl" p="lg" withBorder shadow="sm">
            <Group justify="space-between" align="flex-start">
              <Stack gap={2}>
                <Text c="dimmed" size="sm">
                  Total Users
                </Text>
                <Title order={3}>{totalUsers}</Title>
              </Stack>
              <ThemeIcon size={42} radius="xl" variant="light" color="teal">
                <IconUsers size={20} />
              </ThemeIcon>
            </Group>
          </Card>

          <Card radius="xl" p="lg" withBorder shadow="sm">
            <Group justify="space-between" align="flex-start">
              <Stack gap={2}>
                <Text c="dimmed" size="sm">
                  Total Stations
                </Text>
                <Title order={3}>{totalStations}</Title>
              </Stack>
              <ThemeIcon size={42} radius="xl" variant="light" color="blue">
                <IconMapPin size={20} />
              </ThemeIcon>
            </Group>
          </Card>

          <Card radius="xl" p="lg" withBorder shadow="sm">
            <Group justify="space-between" align="flex-start">
              <Stack gap={2}>
                <Text c="dimmed" size="sm">
                  Daily Transactions
                </Text>
                <Title order={3}>{dailyTransactions}</Title>
              </Stack>
              <ThemeIcon size={42} radius="xl" variant="light" color="orange">
                <IconCreditCard size={20} />
              </ThemeIcon>
            </Group>
          </Card>
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          <Card radius="xl" p="lg" withBorder shadow="sm">
            <Group justify="space-between" align="flex-start" mb="md">
              <Stack gap={2}>
                <Text fw={700} fz="lg">
                  Top-ups
                </Text>
                <Text c="dimmed" size="sm">
                  Credit top-ups by date
                </Text>
              </Stack>
            </Group>

            <AreaChart
              h={220}
              data={chartData}
              dataKey="date"
              series={[{ name: 'topUps', color: 'green.6' }]}
              curveType="monotone"
              gridAxis="y"
              tickLine="none"
            />
          </Card>

          <Card radius="xl" p="lg" withBorder shadow="sm">
            <Group justify="space-between" align="flex-start" mb="md">
              <Stack gap={2}>
                <Text fw={700} fz="lg">
                  Payments
                </Text>
                <Text c="dimmed" size="sm">
                  Charging payments by date
                </Text>
              </Stack>
            </Group>

            <AreaChart
              h={220}
              data={chartData}
              dataKey="date"
              series={[{ name: 'payments', color: 'blue.6' }]}
              curveType="monotone"
              gridAxis="y"
              tickLine="none"
            />
          </Card>
        </SimpleGrid>
      </Container>
    </Box>
  )
}
