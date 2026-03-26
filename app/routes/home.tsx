import type { Route } from "./+types/home";
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
} from "@mantine/core";
import {
  IconArrowRight,
  IconBolt,
  IconClockBolt,
  IconGauge,
  IconLeaf,
  IconMapPin,
  IconShieldCheck,
} from "@tabler/icons-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "EV Station | Mantine UI" },
    {
      name: "description",
      content: "A Mantine-powered landing page for EV station operations.",
    },
  ];
}

const metrics = [
  { value: "128", label: "Active chargers", note: "+14 today" },
  { value: "98.6%", label: "Network uptime", note: "Last 30 days" },
  { value: "42 min", label: "Average session", note: "Public fast charge" },
];

const stations = [
  { name: "Downtown Hub", progress: 92, status: "Online" },
  { name: "Riverside Lot", progress: 74, status: "Balanced" },
  { name: "Airport Express", progress: 61, status: "Steady" },
];

const features = [
  {
    icon: IconGauge,
    title: "Operator clarity",
    description:
      "Surface load, uptime, and revenue in a layout that reads quickly under pressure.",
  },
  {
    icon: IconShieldCheck,
    title: "Reliable controls",
    description:
      "Consistent spacing, states, and hierarchy make the UI feel dependable and easy to scan.",
  },
  {
    icon: IconLeaf,
    title: "Lower friction",
    description:
      "Mantine gives you polished components fast, so you can spend time on product work instead of scaffolding.",
  },
];

export default function Home() {
  return (
    <Box
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(180deg, rgba(241, 250, 248, 0.96) 0%, rgba(232, 245, 255, 0.9) 45%, rgba(248, 250, 252, 1) 100%)",
      }}
    >
      <Box
        aria-hidden
        style={{
          position: "absolute",
          inset: "-10% auto auto -6%",
          width: 360,
          height: 360,
          borderRadius: "999px",
          background: "rgba(20, 184, 166, 0.18)",
          filter: "blur(18px)",
          pointerEvents: "none",
        }}
      />
      <Box
        aria-hidden
        style={{
          position: "absolute",
          right: "-8%",
          top: 140,
          width: 420,
          height: 420,
          borderRadius: "999px",
          background: "rgba(56, 189, 248, 0.15)",
          filter: "blur(24px)",
          pointerEvents: "none",
        }}
      />

      <Container size="xl" py="xl" style={{ position: "relative" }}>
        <Group justify="space-between" align="center" mb="xl">
          <Group gap="sm">
            <ThemeIcon size={44} radius="xl" variant="gradient" gradient={{ from: "teal.5", to: "cyan.5", deg: 135 }}>
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
            <Button variant="subtle" color="teal" leftSection={<IconMapPin size={16} />}>
              Sites
            </Button>
          </Group>
        </Group>

        <Paper
          radius="xl"
          p={{ base: "lg", md: "xl", lg: 40 }}
          shadow="xl"
          withBorder={false}
          style={{
            background:
              "linear-gradient(135deg, rgba(6, 95, 70, 0.96) 0%, rgba(13, 148, 136, 0.94) 45%, rgba(8, 145, 178, 0.92) 100%)",
            color: "white",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            aria-hidden
            style={{
              position: "absolute",
              inset: "auto -120px -120px auto",
              width: 280,
              height: 280,
              borderRadius: "999px",
              background: "rgba(255, 255, 255, 0.12)",
              filter: "blur(12px)",
            }}
          />

          <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="xl">
            <Stack gap="lg" style={{ position: "relative" }}>
              <Badge variant="light" color="cyan" radius="xl" size="lg" w="fit-content">
                Mantine UI system
              </Badge>
              <Title order={1} maw={650} fw={900} fz={{ base: 40, md: 56 }} lh={0.95}>
                Build a charging platform that feels calm, sharp, and ready for operations.
              </Title>
              <Text c="rgba(255,255,255,0.82)" fz={{ base: "md", md: "lg" }} maw={620} lh={1.65}>
                This landing page uses Mantine components for structure, typography, and interaction states, giving the
                EV station experience a clear visual hierarchy without a heavy custom design system.
              </Text>

              <Group gap="sm">
                <Button size="md" color="dark" variant="filled" rightSection={<IconArrowRight size={16} />}>
                  Open dashboard
                </Button>
                <Button size="md" variant="white" color="teal">
                  Explore stations
                </Button>
              </Group>

              <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                {metrics.map((metric) => (
                  <Paper
                    key={metric.label}
                    radius="lg"
                    p="md"
                    style={{ background: "rgba(255, 255, 255, 0.14)" }}
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

            <Card radius="xl" p="lg" withBorder style={{ background: "rgba(8, 15, 24, 0.3)", backdropFilter: "blur(18px)" }}>
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
                <Card radius="999px" p="lg" withBorder={false} style={{ background: "rgba(255,255,255,0.08)" }}>
                  <Stack gap={4} align="center">
                    <Text c="white" fw={800} fz={32} lh={1}>
                      84%
                    </Text>
                    <Text c="rgba(255,255,255,0.72)" size="xs" tt="uppercase" fw={700}>
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
                    <Progress value={station.progress} color="teal" size="md" radius="xl" />
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
          p={{ base: "lg", md: "xl" }}
          withBorder
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,253,250,0.95) 100%)",
          }}
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
                Mantine gives you accessible primitives, strong defaults, and a consistent spacing scale. That makes
                this EV station shell a solid base for analytics, station management, and operator workflows.
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
  );
}
