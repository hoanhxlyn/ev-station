import {
  Anchor,
  Box,
  Button,
  Badge,
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
} from "@mantine/core";
import { IconBrandGithub, IconBrandGoogle, IconBolt, IconLock, IconUser } from "@tabler/icons-react";
import { Link } from "react-router";
import styles from "./login.module.css";

export function meta() {
  return [
    { title: "EV Station | Login" },
    {
      name: "description",
      content: "Login screen for EV Station with account, password, remember me, and social sign-in options.",
    },
  ];
}

export default function Login() {
  return (
    <Box h="100vh" pos="relative" className={styles.pageShell}>
      <Box aria-hidden className={styles.bgBlobTopLeft} />
      <Box aria-hidden className={styles.bgBlobTopRight} />

      <Container size="xl" py={{ base: 20, sm: 32, lg: 48 }} pos="relative">
        <Paper radius="32px" shadow="xl" withBorder className={styles.cardShell}>
          <Group grow align="stretch" gap={0} wrap="nowrap">
            <Box visibleFrom="lg" className={styles.leftPanel}>
              <Box aria-hidden className={styles.leftPanelInset} />
              <Stack gap="lg" className={styles.leftPanelContent} justify="space-between">
                <Stack gap="md">
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

                  <Stack gap={6} maw={420} pt="md">
                    <Text fw={700} tt="uppercase" size="xs" c="rgba(255,255,255,0.72)">
                      Electric fleet access
                    </Text>
                    <Title order={1} fw={900} fz={48} lh={0.95}>
                      Drive into the control room with one secure sign-in.
                    </Title>
                    <Text c="rgba(255,255,255,0.82)" lh={1.7} size="lg">
                      Keep charging operations, station health, and fleet visibility under one calm interface.
                    </Text>
                  </Stack>
                </Stack>

                <Box className={styles.heroCard}>
                  <Image
                    src="https://images.unsplash.com/photo-1704475336842-0ab3798abf0e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Electric car charging illustration"
                    radius="24px"
                    fit="contain"
                    className={styles.heroImage}
                  />
                  <Group justify="space-between" mt="md" align="center">
                    <Stack gap={0}>
                      <Text size="sm" fw={700} c="white">
                        Fast charge ready
                      </Text>
                      <Text size="xs" c="rgba(255,255,255,0.74)">
                        Clean handoff for drivers and operators
                      </Text>
                    </Stack>
                    <ThemeIcon size={44} radius="xl" variant="light" color="cyan">
                      <IconBolt size={20} />
                    </ThemeIcon>
                  </Group>
                </Box>
              </Stack>
            </Box>

            <Box className={styles.rightPanel}>
              <Stack gap="xl" w="100%" maw={520} mx="auto">
                <Stack gap={8}>
                  <BadgeRow />
                  <Title order={2} fw={900} fz={{ base: 32, sm: 40 }} lh={1.05}>
                    Sign in to your EV Station account
                  </Title>
                  <Text c="dimmed" lh={1.7}>
                    Use your operator account to manage stations, vehicles, and charging activity.
                  </Text>
                </Stack>

                <Box component="form" onSubmit={(event) => event.preventDefault()}>
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

                <Divider label="Or connect with social links" labelPosition="center" />

                <SimpleSocialLinks />

                <Text c="dimmed" size="sm" ta="center">
                  Need access? <Anchor href="#">Contact your administrator</Anchor>.
                </Text>

                <Button component={Link} to="/" variant="subtle" radius="lg" size="sm" mx="auto">
                  Back to home
                </Button>
              </Stack>
            </Box>
          </Group>
        </Paper>
      </Container>
    </Box>
  );
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
  );
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
  );
}
