import { Carousel } from '@mantine/carousel'
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import {
  IconArrowRight,
  IconBolt,
  IconChartBar,
  IconCreditCard,
  IconLeaf,
  IconMapPin,
  IconQuote,
  IconShieldCheck,
  IconBoltFilled as IconZap,
} from '@tabler/icons-react'
import Autoplay from 'embla-carousel-autoplay'
import { useRef } from 'react'
import { Link } from 'react-router'
import { ROUTES } from '~/constants/routes'
import styles from './home.module.css'

export function meta() {
  return [
    { title: 'EV Station | Smart Charging Platform' },
    {
      name: 'description',
      content:
        'EV Station — find, charge, and track your electric vehicle sessions with ease.',
    },
  ]
}

const stats = [
  { value: '2,400+', label: 'Charging stations' },
  { value: '98.6%', label: 'Network uptime' },
  { value: '150K+', label: 'Sessions completed' },
]

const summaryFeatures = [
  {
    icon: IconMapPin,
    title: 'Find nearby stations',
    description:
      'Locate available chargers in real time with live status updates across the network.',
  },
  {
    icon: IconChartBar,
    title: 'Track your sessions',
    description:
      'View detailed charging history, energy consumed, and cost breakdowns in your dashboard.',
  },
  {
    icon: IconCreditCard,
    title: 'Manage your credits',
    description:
      'Top up your balance, monitor spending, and get notified when credits run low.',
  },
  {
    icon: IconShieldCheck,
    title: 'Secure and reliable',
    description:
      'Enterprise-grade encryption with 99.9% uptime so your charging is never interrupted.',
  },
  {
    icon: IconLeaf,
    title: 'Go greener',
    description:
      'Track your carbon offset and contribute to a cleaner planet with every charge.',
  },
  {
    icon: IconZap,
    title: 'Fast charging support',
    description:
      'Compatible with DC fast chargers delivering up to 350 kW for rapid top-ups.',
  },
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Fleet Manager, GreenDrive Co.',
    avatar: 'SC',
    content:
      'EV Station cut our fleet downtime by 40%. The real-time availability map is a game-changer for route planning.',
  },
  {
    name: 'Marcus Rivera',
    role: 'Daily Commuter',
    avatar: 'MR',
    content:
      'I charge my car every morning on the way to work. The app finds the nearest station in seconds — no more range anxiety.',
  },
  {
    name: 'Dr. Aisha Patel',
    role: 'Sustainability Director, EcoTech',
    avatar: 'AP',
    content:
      'The carbon tracking feature helps us report our sustainability metrics effortlessly. Our board loves the dashboards.',
  },
  {
    name: "James O'Brien",
    role: 'Ride-share Driver',
    avatar: 'JO',
    content:
      'The credit system is seamless. I top up once a week and never worry about payment at the station.',
  },
  {
    name: 'Yuki Tanaka',
    role: 'EV Owner',
    avatar: 'YT',
    content:
      'Switched from three different charging apps to just EV Station. The session history and cost breakdown are unmatched.',
  },
  {
    name: 'Elena Kowalski',
    role: 'City Transport Planner',
    avatar: 'EK',
    content:
      'We deployed the network analytics to plan new station placements. The uptime data gave us the confidence to scale fast.',
  },
]

export default function Home() {
  const autoplay = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }))

  return (
    <Box className={styles.pageShell}>
      {/* ─── Section 1: Hero ─── */}
      <Box component="section" className={styles.heroSection}>
        <Box aria-hidden className={styles.heroBlobLeft} />
        <Box aria-hidden className={styles.heroBlobRight} />
        <Box aria-hidden className={styles.heroGlow} />

        <Container size="xl" pos="relative" py={{ base: '4xl', lg: '100' }}>
          <Stack align="center" gap="xl" ta="center" className={styles.fadeIn}>
            <Badge
              variant="light"
              color="cyan"
              radius="xl"
              size="lg"
              className={styles.slideDown}
            >
              The future of EV charging
            </Badge>

            <Title
              order={1}
              fw={900}
              fz={{ base: 36, sm: 48, md: 64 }}
              lh={1}
              maw={800}
              c="white"
              className={styles.slideUp}
            >
              Charge smarter.{' '}
              <Text component="span" inherit className={styles.gradientText}>
                Drive further.
              </Text>
            </Title>

            <Text
              c="rgba(255,255,255,0.78)"
              fz={{ base: 'md', md: 'xl' }}
              maw={640}
              lh={1.7}
              className={styles.slideUp}
            >
              Find stations, track sessions, and manage your credits — all in
              one place. Built for EV drivers who value speed and simplicity.
            </Text>

            <Group gap="md" className={styles.slideUp}>
              <Button
                component={Link}
                to={ROUTES.LOGIN}
                size="lg"
                variant="white"
                rightSection={<IconArrowRight size={18} />}
              >
                Get started
              </Button>
              <Button
                component={Link}
                to={ROUTES.SIGNUP}
                size="lg"
                variant="outline"
                color="white"
              >
                Create account
              </Button>
            </Group>

            <SimpleGrid
              cols={{ base: 1, sm: 3 }}
              spacing="lg"
              mt="xl"
              className={styles.slideUp}
            >
              {stats.map((stat) => (
                <Paper key={stat.label} p="lg" className={styles.statCard}>
                  <Text fw={900} fz={28} c="white" lh={1}>
                    {stat.value}
                  </Text>
                  <Text c="rgba(255,255,255,0.65)" size="sm" mt={4}>
                    {stat.label}
                  </Text>
                </Paper>
              ))}
            </SimpleGrid>
          </Stack>

          <Box className={styles.heroCarOuter}>
            <ThemeIcon
              size={80}
              radius="xl"
              variant="gradient"
              gradient={{ from: 'teal.4', to: 'cyan.4', deg: 135 }}
              className={styles.pulseRing}
            >
              <IconBolt size={40} />
            </ThemeIcon>
          </Box>
        </Container>
      </Box>

      {/* ─── Section 2: Application Summary ─── */}
      <Box component="section" py={{ base: 'xl', md: '4xl' }}>
        <Container size="xl">
          <Stack align="center" ta="center" gap="sm" mb="xl">
            <Badge variant="light" color="teal" radius="xl">
              Why EV Station
            </Badge>
            <Title order={2} fw={900} fz={{ base: 28, md: 40 }}>
              Everything you need to charge with confidence
            </Title>
            <Text c="dimmed" maw={600} lh={1.7}>
              From finding the nearest charger to tracking your carbon offset,
              EV Station brings your entire charging experience into a single,
              beautiful dashboard.
            </Text>
          </Stack>

          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
            {summaryFeatures.map((feature) => (
              <Card
                key={feature.title}
                radius="xl"
                p="xl"
                withBorder
                shadow="sm"
                className={styles.featureCard}
              >
                <ThemeIcon
                  size={48}
                  radius="xl"
                  variant="light"
                  color="teal"
                  mb="md"
                >
                  <feature.icon size={24} />
                </ThemeIcon>
                <Text fw={700} fz="lg" mb={4}>
                  {feature.title}
                </Text>
                <Text c="dimmed" lh={1.65}>
                  {feature.description}
                </Text>
              </Card>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* ─── Section 3: User Testimonials ─── */}
      <Box
        component="section"
        py={{ base: 'xl', md: '4xl' }}
        className={styles.testimonialSection}
      >
        <Container size="xl">
          <Stack align="center" ta="center" gap="sm" mb="xl">
            <Badge variant="light" color="cyan" radius="xl">
              Loved by drivers
            </Badge>
            <Title order={2} fw={900} fz={{ base: 28, md: 40 }}>
              What our users are saying
            </Title>
            <Text c="dimmed" maw={520} lh={1.7}>
              Thousands of EV drivers trust our platform every day
            </Text>
          </Stack>
        </Container>

        <Carousel
          slideSize={{ base: '85%', sm: '45%', lg: '30%' }}
          slideGap="lg"
          withControls={false}
          plugins={[autoplay.current]}
          emblaOptions={{ loop: true }}
          classNames={{ root: styles.testimonialCarousel }}
        >
          {testimonials.map((t) => (
            <Carousel.Slide key={t.name}>
              <Card
                radius="xl"
                p="xl"
                withBorder
                shadow="sm"
                h="100%"
                className={styles.testimonialCard}
              >
                <IconQuote size={28} color="var(--mantine-color-teal-4)" />
                <Text lh={1.7} mt="sm" mb="lg">
                  {t.content}
                </Text>
                <Group mt="auto">
                  <Avatar color="teal" radius="xl">
                    {t.avatar}
                  </Avatar>
                  <Stack gap={2}>
                    <Text fw={700} size="sm">
                      {t.name}
                    </Text>
                    <Text c="dimmed" size="xs">
                      {t.role}
                    </Text>
                  </Stack>
                </Group>
              </Card>
            </Carousel.Slide>
          ))}
        </Carousel>
      </Box>
    </Box>
  )
}
