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
} from '@mantine/core'
import { useForm } from '@mantine/form'
import {
  IconBolt,
  IconClock,
  IconPlayerPlay,
  IconPlayerStop,
  IconX,
} from '@tabler/icons-react'
import { useFetcher, useRevalidator } from 'react-router'
import { useEffect, useState } from 'react'
import { CREDIT_UNIT } from '~/constants/dashboard'
import { formatCurrency } from '~/lib/format-utils'
import styles from './page.module.css'
import type { Route } from './+types/page'

export { chargingLoader as loader } from './loader'
export { chargingAction as action } from './actions'

export function meta() {
  return [
    { title: 'EV Station | Charging' },
    {
      name: 'description',
      content: 'Manage your EV charging sessions.',
    },
  ]
}

function formatDuration(startAt: Date): string {
  const now = Date.now()
  const diff = now - startAt.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

export default function ChargingPage({ loaderData }: Route.ComponentProps) {
  const { activeSession, recentSessions, stations, vehicles } = loaderData
  const fetcher = useFetcher()
  const revalidator = useRevalidator()
  const [elapsed, setElapsed] = useState('')

  useEffect(() => {
    if (!activeSession) return

    const interval = setInterval(() => {
      setElapsed(formatDuration(activeSession.startAt))
    }, 1000)

    return () => clearInterval(interval)
  }, [activeSession])

  useEffect(() => {
    if (activeSession) {
      const interval = setInterval(() => {
        revalidator.revalidate()
      }, 30000)
      return () => clearInterval(interval)
    }
  }, [activeSession, revalidator])

  const form = useForm({
    initialValues: {
      stationId: '',
      vehicleId: '',
    },
    validate: {
      stationId: (value) => (!value ? 'Station is required' : null),
      vehicleId: (value) => (!value ? 'Vehicle is required' : null),
    },
  })

  const handleStartSession = () => {
    const validation = form.validate()
    if (validation.hasErrors) return

    fetcher.submit(
      {
        intent: 'start',
        stationId: form.values.stationId,
        vehicleId: form.values.vehicleId,
      },
      { method: 'post' },
    )
  }

  const handleEndSession = () => {
    if (!activeSession) return
    fetcher.submit(
      { intent: 'end', sessionId: activeSession.id },
      { method: 'post' },
    )
  }

  const handleCancelSession = () => {
    if (!activeSession) return
    fetcher.submit(
      { intent: 'cancel', sessionId: activeSession.id },
      { method: 'post' },
    )
  }

  const isLoading = fetcher.state !== 'idle'

  const stationOptions = stations.map((s) => ({
    value: s.id,
    label: `${s.name} (${s.powerOutput}kW)`,
  }))

  const vehicleOptions = vehicles.map((v) => ({
    value: v.id,
    label: `${v.brand} ${v.model} - ${v.licensePlate}`,
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
              gradient={{ from: 'teal.5', to: 'cyan.5', deg: 135 }}
            >
              <IconBolt size={22} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text fw={800} lh={1.1} size="lg">
                Charging
              </Text>
              <Text size="sm" c="dimmed">
                Manage your charging sessions
              </Text>
            </Stack>
          </Group>
        </Group>

        {activeSession ? (
          <Card radius="xl" p="lg" withBorder shadow="sm" mb="xl">
            <Group justify="space-between" align="flex-start" mb="md">
              <Stack gap={2}>
                <Group gap="xs">
                  <Badge color="teal" variant="light" size="lg" radius="xl">
                    Active Session
                  </Badge>
                </Group>
                <Text fw={700} fz="lg" mt="sm">
                  {activeSession.station.name}
                </Text>
                <Text c="dimmed" size="sm">
                  {activeSession.station.location}
                </Text>
              </Stack>
              <ThemeIcon size={42} radius="xl" variant="light" color="teal">
                <IconBolt size={20} />
              </ThemeIcon>
            </Group>

            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" mb="lg">
              <Card p="md" radius="lg" bg="gray.0">
                <Text size="sm" c="dimmed">
                  Vehicle
                </Text>
                <Text fw={600}>
                  {activeSession.vehicle.brand} {activeSession.vehicle.model}
                </Text>
                <Text size="xs" c="dimmed">
                  {activeSession.vehicle.licensePlate}
                </Text>
              </Card>
              <Card p="md" radius="lg" bg="gray.0">
                <Text size="sm" c="dimmed">
                  Duration
                </Text>
                <Text fw={600} fz="lg">
                  {elapsed}
                </Text>
              </Card>
              <Card p="md" radius="lg" bg="gray.0">
                <Text size="sm" c="dimmed">
                  Power Output
                </Text>
                <Text fw={600}>{activeSession.station.powerOutput} kW</Text>
              </Card>
            </SimpleGrid>

            <Group justify="flex-end" gap="sm">
              <Button
                variant="outline"
                color="red"
                leftSection={<IconX size={18} />}
                onClick={handleCancelSession}
                loading={isLoading}
              >
                Cancel
              </Button>
              <Button
                color="teal"
                leftSection={<IconPlayerStop size={18} />}
                onClick={handleEndSession}
                loading={isLoading}
              >
                End Session
              </Button>
            </Group>
          </Card>
        ) : (
          <Card radius="xl" p="lg" withBorder shadow="sm" mb="xl">
            <Group justify="space-between" align="flex-start" mb="md">
              <Stack gap={2}>
                <Text fw={700} fz="lg">
                  Start New Session
                </Text>
                <Text c="dimmed" size="sm">
                  Select a station and vehicle to begin charging
                </Text>
              </Stack>
              <ThemeIcon size={42} radius="xl" variant="light" color="teal">
                <IconPlayerPlay size={20} />
              </ThemeIcon>
            </Group>

            {stations.length === 0 ? (
              <Text c="dimmed" py="md">
                No available stations at the moment.
              </Text>
            ) : vehicles.length === 0 ? (
              <Text c="dimmed" py="md">
                Please add a vehicle first to start charging.
              </Text>
            ) : (
              <fetcher.Form method="post">
                <input type="hidden" name="intent" value="start" />
                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                  <Select
                    label="Station"
                    placeholder="Select a station"
                    data={stationOptions}
                    name="stationId"
                    key={form.key('stationId')}
                    {...form.getInputProps('stationId')}
                  />
                  <Select
                    label="Vehicle"
                    placeholder="Select a vehicle"
                    data={vehicleOptions}
                    name="vehicleId"
                    key={form.key('vehicleId')}
                    {...form.getInputProps('vehicleId')}
                  />
                  <Button
                    type="button"
                    onClick={handleStartSession}
                    loading={isLoading}
                    mt="auto"
                    leftSection={<IconPlayerPlay size={18} />}
                  >
                    Start Charging
                  </Button>
                </SimpleGrid>
              </fetcher.Form>
            )}
          </Card>
        )}

        <Card radius="xl" p="lg" withBorder shadow="sm">
          <Group justify="space-between" align="flex-start" mb="md">
            <Stack gap={2}>
              <Text fw={700} fz="lg">
                Session History
              </Text>
              <Text c="dimmed" size="sm">
                Your recent charging sessions
              </Text>
            </Stack>
            <ThemeIcon size={42} radius="xl" variant="light" color="teal">
              <IconClock size={20} />
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
                            ? `${formatCurrency(session.cost, CREDIT_UNIT.DIVISOR)} ${CREDIT_UNIT.LABEL}`
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
