import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Group,
  Paper,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import {
  IconArrowRight,
  IconBolt,
  IconClockBolt,
  IconGauge,
  IconLeaf,
  IconMapPin,
  IconShieldCheck,
} from '@tabler/icons-react'
import { Link } from 'react-router'
import { ROUTES } from '~/constants/routes'
import styles from './home.module.css'

export function meta() {
  return [
    { title: 'EV Station | Mantine UI' },
    {
      name: 'description',
      content: 'A Mantine-powered landing page for EV station operations.',
    },
  ]
}

const metrics = [
  { value: '128', label: 'Active chargers', note: '+14 today' },
  { value: '98.6%', label: 'Network uptime', note: 'Last 30 days' },
  { value: '42 min', label: 'Average session', note: 'Public fast charge' },
]

const stations = [
  { name: 'Downtown Hub', progress: 92, status: 'Online' },
  { name: 'Riverside Lot', progress: 74, status: 'Balanced' },
  { name: 'Airport Express', progress: 61, status: 'Steady' },
]

const features = [
  {
    icon: IconGauge,
    title: 'Operator clarity',
    description:
      'Surface load, uptime, and revenue in a layout that reads quickly under pressure.',
  },
  {
    icon: IconShieldCheck,
    title: 'Reliable controls',
    description:
      'Consistent spacing, states, and hierarchy make the UI feel dependable and easy to scan.',
  },
  {
    icon: IconLeaf,
    title: 'Lower friction',
    description:
      'Mantine gives you polished components fast, so you can spend time on product work instead of scaffolding.',
  },
]

export default function Home() {
  return (
    <Box className={styles.pageShell}>
      <Box aria-hidden className={styles.bgBlobTopLeft} />
      <Box aria-hidden className={styles.bgBlobTopRight} />

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
                Charging operations dashboard
              </Text>
            </Stack>
          </Group>

          <Group gap="xs" visibleFrom="sm">
            <Badge variant="light" color="teal" radius="xl">
              Live network
            </Badge>
            <Button
              variant="subtle"
              color="teal"
              leftSection={<IconMapPin size={16} />}
            >
              Sites
            </Button>
          </Group>
        </Group>

        <Paper
          radius="xl"
          p={{ base: 'lg', md: 'xl', lg: '2xl' }}
          shadow="xl"
          withBorder={false}
          className={styles.heroPaper}
        >
          <Box aria-hidden className={styles.heroBlobDecorator} />

          <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="xl">
            <Stack gap="lg" style={{ position: 'relative' }}>
              <Badge
                variant="light"
                color="cyan"
                radius="xl"
                size="lg"
                w="fit-content"
              >
                Mantine UI system
              </Badge>
              <Title
                order={1}
                maw={650}
                fw={900}
                fz={{ base: 40, md: 56 }}
                lh={0.95}
              >
                Build a charging platform that feels calm, sharp, and ready for
                operations.
              </Title>
              <Text
                c="rgba(255,255,255,0.82)"
                fz={{ base: 'md', md: 'lg' }}
                maw={620}
                lh={1.65}
              >
                This landing page uses Mantine components for structure,
                typography, and interaction states, giving the EV station
                experience a clear visual hierarchy without a heavy custom
                design system.
              </Text>

              <Group gap="sm">
                <Button
                  component={Link}
                  to={ROUTES.LOGIN}
                  color="dark"
                  variant="filled"
                  rightSection={<IconArrowRight size={16} />}
                >
                  Open dashboard
                </Button>
                <Button variant="white" color="teal">
                  Explore stations
                </Button>
              </Group>

              <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                {metrics.map((metric) => (
                  <Paper
                    key={metric.label}
                    p="md"
                    className={styles.metricPaper}
                  >
                    <Text size="sm" c="rgba(255,255,255,0.76)">
                      {metric.label}
                    </Text>
                    <Text fw={800} fz="xl" mt={4}>
                      {metric.value}
                    </Text>
                    <Text size="xs" c="rgba(255,255,255,0.7)" mt={4}>
                      {metric.note}
                    </Text>
                  </Paper>
                ))}
              </SimpleGrid>
            </Stack>

            <Card radius="xl" p="lg" withBorder className={styles.stationCard}>
              <Group justify="space-between" align="flex-start" mb="lg">
                <Stack gap={2}>
                  <Text c="rgba(255,255,255,0.75)" size="sm">
                    Network load
                  </Text>
                  <Title order={3} c="white">
                    Real-time station health
                  </Title>
                </Stack>
                <ThemeIcon size={42} radius="xl" variant="light" color="teal">
                  <IconClockBolt size={20} />
                </ThemeIcon>
              </Group>

              <Group justify="center" mb="lg">
                <Card
                  radius="999px"
                  p="lg"
                  withBorder={false}
                  className={styles.capacityCard}
                >
                  <Stack gap={4} align="center">
                    <Text c="white" fw={800} fz={32} lh={1}>
                      84%
                    </Text>
                    <Text
                      c="rgba(255,255,255,0.72)"
                      size="xs"
                      tt="uppercase"
                      fw={700}
                    >
                      capacity used
                    </Text>
                  </Stack>
                </Card>
              </Group>

              <Stack gap="md">
                {stations.map((station) => (
                  <Stack key={station.name} gap={6}>
                    <Group justify="space-between" align="center">
                      <Text c="white" fw={600}>
                        {station.name}
                      </Text>
                      <Badge variant="filled" color="teal" radius="xl">
                        {station.status}
                      </Badge>
                    </Group>
                    <Progress
                      value={station.progress}
                      color="teal"
                      size="md"
                      radius="xl"
                    />
                  </Stack>
                ))}
              </Stack>
            </Card>
          </SimpleGrid>
        </Paper>

        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg" mt="lg">
          {features.map((feature) => (
            <Card key={feature.title} radius="xl" p="lg" withBorder shadow="sm">
              <Stack gap="md">
                <ThemeIcon size={44} radius="xl" variant="light" color="teal">
                  <feature.icon size={22} />
                </ThemeIcon>
                <Stack gap={4}>
                  <Text fw={800} fz="lg">
                    {feature.title}
                  </Text>
                  <Text c="dimmed" lh={1.65}>
                    {feature.description}
                  </Text>
                </Stack>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>

        <Paper
          mt="lg"
          radius="xl"
          p={{ base: 'lg', md: 'xl' }}
          withBorder
          className={styles.ctaPaper}
        >
          <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
            <Stack gap="sm">
              <Badge variant="light" color="teal" radius="xl" w="fit-content">
                Next step
              </Badge>
              <Title order={2} fw={900}>
                Keep the UI fast to read and easy to extend.
              </Title>
              <Text c="dimmed" maw={620} lh={1.7}>
                Mantine gives you accessible primitives, strong defaults, and a
                consistent spacing scale. That makes this EV station shell a
                solid base for analytics, station management, and operator
                workflows.
              </Text>
            </Stack>

            <Group justify="flex-end" align="center">
              <Button size="lg" rightSection={<IconArrowRight size={16} />}>
                Continue building
              </Button>
            </Group>
          </SimpleGrid>
        </Paper>
      </Container>
    </Box>
  )
}
