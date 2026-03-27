import { Carousel } from '@mantine/carousel'
import {
  Anchor,
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  Group,
  Image,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core'
import {
  IconBolt,
  IconBrandGithub,
  IconBrandGoogle,
  IconLock,
  IconUser,
} from '@tabler/icons-react'
import Autoplay from 'embla-carousel-autoplay'
import { useRef } from 'react'
import { Link } from 'react-router'
import styles from './login.module.css'

const LEFT_PANEL_IMAGES = [
  'https://images.unsplash.com/photo-1704475336842-0ab3798abf0e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1768907038230-e66e6a66583f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fEVWJTIwc3RhdGlvbnxlbnwwfHwwfHx8MA%3D%3D',
  'https://plus.unsplash.com/premium_photo-1661659690276-ac675b18aa63?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
]

export function meta() {
  return [
    { title: 'EV Station | Login' },
    {
      name: 'description',
      content:
        'Login screen for EV Station with account, password, remember me, and social sign-in options.',
    },
  ]
}

export default function Login() {
  const autoplay = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }))

  return (
    <Box mih="100vh" pos="relative" className={styles.pageShell}>
      <Box aria-hidden className={styles.bgBlobTopLeft} />
      <Box aria-hidden className={styles.bgBlobTopRight} />

      <Container
        size="xl"
        py={{ base: 'lg', sm: '3xl', lg: '4xl' }}
        pos="relative"
      >
        <Paper
          radius="32px"
          shadow="xl"
          withBorder
          className={styles.cardShell}
        >
          <Group align="stretch" gap={0} wrap="nowrap">
            <Box visibleFrom="lg" className={styles.leftPanel}>
              <Box className={styles.leftPanelMedia}>
                <Carousel
                  withControls={false}
                  withIndicators
                  height="100%"
                  classNames={{
                    root: styles.leftPanelCarousel,
                    viewport: styles.leftPanelCarouselViewport,
                    container: styles.leftPanelCarouselContainer,
                    slide: styles.leftPanelCarouselSlide,
                    indicators: styles.carouselIndicators,
                    indicator: styles.carouselIndicator,
                  }}
                  plugins={[autoplay.current]}
                  emblaOptions={{ loop: true, watchDrag: false }}
                >
                  {LEFT_PANEL_IMAGES.map((image) => (
                    <Carousel.Slide key={`${image}`}>
                      <Image
                        src={image}
                        alt="Electric car charging illustration"
                        className={styles.leftPanelImage}
                      />
                      <Box aria-hidden className={styles.leftPanelOverlay} />
                    </Carousel.Slide>
                  ))}
                </Carousel>

                <Stack gap="lg" className={styles.leftPanelContent}>
                  <Group gap="sm">
                    <ThemeIcon
                      size={44}
                      radius="xl"
                      variant="light"
                      color="teal"
                    >
                      <IconBolt size={22} />
                    </ThemeIcon>
                    <Stack gap={0}>
                      <Text fw={800} size="lg" lh={1.1}>
                        EV Station
                      </Text>
                      <Text size="sm" c="rgba(255,255,255,0.72)">
                        Operator access portal
                      </Text>
                    </Stack>
                  </Group>

                  <Stack gap={6} maw="28ch" pt="md">
                    <Text
                      fw={700}
                      tt="uppercase"
                      size="xs"
                      c="rgba(255,255,255,0.72)"
                    >
                      Electric fleet access
                    </Text>
                    <Title order={1} fw={900} fz={48} lh={0.95}>
                      Drive into the control room with one secure sign-in.
                    </Title>
                    <Text c="rgba(255,255,255,0.82)" lh={1.7} size="lg">
                      Keep charging operations, station health, and fleet
                      visibility under one calm interface.
                    </Text>
                  </Stack>
                </Stack>
              </Box>
            </Box>

            <Box className={styles.rightPanel}>
              <Stack
                gap="xl"
                w="100%"
                flex={1}
                miw={0}
                className={styles.rightPanelContent}
              >
                <Stack gap={8}>
                  <Group
                    hiddenFrom="lg"
                    gap="sm"
                    className={styles.mobileBrand}
                  >
                    <ThemeIcon
                      size={40}
                      radius="xl"
                      variant="light"
                      color="teal"
                    >
                      <IconBolt size={20} />
                    </ThemeIcon>
                    <Stack gap={0}>
                      <Text fw={800} size="lg" lh={1.1}>
                        EV Station
                      </Text>
                      <Text size="sm" c="dimmed">
                        Operator access portal
                      </Text>
                    </Stack>
                  </Group>
                  <BadgeRow />
                  <Title order={2} fw={900} fz={{ base: 32, sm: 40 }} lh={1.05}>
                    Sign in to your EV Station account
                  </Title>
                  <Text c="dimmed" lh={1.7}>
                    Use your operator account to manage stations, vehicles, and
                    charging activity.
                  </Text>
                </Stack>

                <Box
                  component="form"
                  onSubmit={(event) => event.preventDefault()}
                >
                  <Stack gap="md">
                    <TextInput
                      label="Account name"
                      placeholder="Enter your account name"
                      leftSection={<IconUser size={16} />}
                      leftSectionPointerEvents="none"
                      radius="lg"
                      size="md"
                      required
                    />
                    <PasswordInput
                      label="Password"
                      placeholder="Enter your password"
                      leftSection={<IconLock size={16} />}
                      leftSectionPointerEvents="none"
                      radius="lg"
                      size="md"
                      required
                    />
                    <Group justify="space-between" align="center">
                      <Checkbox label="Remember me" radius="md" />
                      <Anchor href="#" size="sm">
                        Forgot password?
                      </Anchor>
                    </Group>

                    <Button size="md" radius="lg" type="submit" fullWidth>
                      Sign in
                    </Button>
                  </Stack>
                </Box>

                <Divider
                  label="Or connect with social links"
                  labelPosition="center"
                />

                <SimpleSocialLinks />

                <Button
                  component={Link}
                  to="/"
                  variant="subtle"
                  radius="lg"
                  size="sm"
                  mx="auto"
                >
                  Back to home
                </Button>
              </Stack>
            </Box>
          </Group>
        </Paper>
      </Container>
    </Box>
  )
}

function BadgeRow() {
  return (
    <Group gap="xs" w="fit-content" px="sm" py={6} className={styles.badgeRow}>
      <ThemeIcon size={22} radius="xl" variant="light" color="teal">
        <IconBolt size={12} />
      </ThemeIcon>
      <Text size="xs" fw={700} tt="uppercase" c="teal.7">
        Secure operator login
      </Text>
    </Group>
  )
}

function SimpleSocialLinks() {
  return (
    <Group grow>
      <Button
        component="a"
        href="#"
        variant="default"
        radius="lg"
        leftSection={<IconBrandGoogle size={18} />}
      >
        Google
      </Button>
      <Button
        component="a"
        href="#"
        variant="default"
        radius="lg"
        leftSection={<IconBrandGithub size={18} />}
      >
        GitHub
      </Button>
    </Group>
  )
}
