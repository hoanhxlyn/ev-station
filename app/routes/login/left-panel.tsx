import { Carousel } from '@mantine/carousel'
import { Box, Group, Image, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { IconBolt } from '@tabler/icons-react'
import Autoplay from 'embla-carousel-autoplay'
import { useRef } from 'react'
import styles from './page.module.css'

const LEFT_PANEL_IMAGES = [
  'https://images.unsplash.com/photo-1704475336842-0ab3798abf0e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1768907038230-e66e6a66583f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fEVWJTIwc3RhdGlvbnxlbnwwfHwwfHx8MA%3D%3D',
  'https://plus.unsplash.com/premium_photo-1661659690276-ac675b18aa63?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
]

export function LoginLeftPanel() {
  const autoplay = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }))

  return (
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
            <Carousel.Slide key={image}>
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
            <ThemeIcon size={44} radius="xl" variant="light" color="teal">
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
            <Text fw={700} tt="uppercase" size="xs" c="rgba(255,255,255,0.72)">
              Electric fleet access
            </Text>
            <Title order={1} fw={900} fz={48} lh={0.95}>
              Drive into the control room with one secure sign-in.
            </Title>
            <Text c="rgba(255,255,255,0.82)" lh={1.7} size="lg">
              Keep charging operations, station health, and fleet visibility
              under one calm interface.
            </Text>
          </Stack>
        </Stack>
      </Box>
    </Box>
  )
}
