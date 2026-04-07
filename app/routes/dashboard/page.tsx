import {
  Badge,
  Box,
  Card,
  Container,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Table,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { BarChart } from '@mantine/charts'
import {
  IconBolt,
  IconCreditCard,
  IconMapPin,
  IconClock,
} from '@tabler/icons-react'
import { DASHBOARD_MESSAGES } from '~/constants/dashboard'
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
  const { user, chargingData, credit, recentStations } = loaderData

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

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" mb="lg">
          <Card
            radius="xl"
            p="lg"
            withBorder
            shadow="sm"
            className={styles.chartCard}
          >
            <Group justify="space-between" align="flex-start" mb="md">
              <Stack gap={2}>
                <Text fw={700} fz="lg">
                  {DASHBOARD_MESSAGES.CHARGING_CHART_TITLE}
                </Text>
                <Text c="dimmed" size="sm">
                  {DASHBOARD_MESSAGES.CHARGING_CHART_SUBTITLE}
                </Text>
              </Stack>
              <ThemeIcon size={42} radius="xl" variant="light" color="teal">
                <IconClock size={20} />
              </ThemeIcon>
            </Group>

            <BarChart
              h={220}
              data={[...chargingData]}
              dataKey="day"
              series={[{ name: 'sessions', color: 'teal.6' }]}
              barProps={{ radius: 8 }}
              gridAxis="y"
              tickLine="none"
            />
          </Card>

          <Card radius="xl" p="lg" shadow="sm" className={styles.creditCard}>
            <Box aria-hidden className={styles.creditBlobDecorator} />
            <Group justify="space-between" align="flex-start" mb="md">
              <Stack gap={2}>
                <Text c="rgba(255,255,255,0.75)" size="sm">
                  {DASHBOARD_MESSAGES.CREDIT_TITLE}
                </Text>
                <Title order={2} c="white">
                  ${credit.balance.toFixed(2)}
                </Title>
                <Text c="rgba(255,255,255,0.6)" size="xs">
                  {DASHBOARD_MESSAGES.CREDIT_REMAINING}
                </Text>
              </Stack>
              <ThemeIcon size={42} radius="xl" variant="light" color="teal">
                <IconCreditCard size={20} />
              </ThemeIcon>
            </Group>

            <Paper p="md" radius="lg" bg="rgba(255,255,255,0.14)" mt="md">
              <Group justify="space-between">
                <Text c="rgba(255,255,255,0.7)" size="sm">
                  Last top-up
                </Text>
                <Text c="white" fw={600} size="sm">
                  {credit.lastTopUp}
                </Text>
              </Group>
            </Paper>
          </Card>
        </SimpleGrid>

        <Card radius="xl" p="lg" withBorder shadow="sm">
          <Group justify="space-between" align="flex-start" mb="md">
            <Stack gap={2}>
              <Text fw={700} fz="lg">
                {DASHBOARD_MESSAGES.RECENT_STATIONS_TITLE}
              </Text>
              <Text c="dimmed" size="sm">
                {DASHBOARD_MESSAGES.RECENT_STATIONS_SUBTITLE}
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
                  <Table.Th>Date</Table.Th>
                  <Table.Th>Duration</Table.Th>
                  <Table.Th>Energy</Table.Th>
                  <Table.Th ta="right">Cost</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {recentStations.map((station) => (
                  <Table.Tr key={station.id}>
                    <Table.Td>
                      <Stack gap={2}>
                        <Text fw={600} size="sm">
                          {station.name}
                        </Text>
                        <Text c="dimmed" size="xs">
                          {station.address}
                        </Text>
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{station.date}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{station.duration}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" color="teal" radius="xl">
                        {station.energy}
                      </Badge>
                    </Table.Td>
                    <Table.Td ta="right">
                      <Text fw={600} size="sm">
                        {station.cost}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Card>
      </Container>
    </Box>
  )
}
