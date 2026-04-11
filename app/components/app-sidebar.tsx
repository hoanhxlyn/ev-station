import {
  AppShell,
  Box,
  Group,
  NavLink,
  Stack,
  Text,
  Button,
  Divider,
} from '@mantine/core'
import {
  IconBolt,
  IconCreditCard,
  IconChargingPile,
  IconCar,
  IconUser,
  IconUsers,
  IconLogout,
  IconDashboard,
} from '@tabler/icons-react'
import { Link } from 'react-router'
import { authClient } from '~/lib/auth-client'
import { ROUTES } from '~/constants/routes'

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    icon: IconDashboard,
    href: ROUTES.APP,
  },
  {
    label: 'Wallet',
    icon: IconCreditCard,
    href: ROUTES.WALLET,
  },
  {
    label: 'Charging',
    icon: IconChargingPile,
    href: ROUTES.CHARGING,
  },
  {
    label: 'Vehicles',
    icon: IconCar,
    href: ROUTES.VEHICLES,
  },
  {
    label: 'Profile',
    icon: IconUser,
    href: ROUTES.PROFILE,
  },
]

const ADMIN_ITEMS = [
  {
    label: 'Admin Dashboard',
    icon: IconBolt,
    href: ROUTES.ADMIN,
  },
  {
    label: 'User Management',
    icon: IconUsers,
    href: ROUTES.ADMIN_USERS,
  },
]

interface AppSidebarProps {
  isAdmin?: boolean
}

export function AppSidebar({ isAdmin = false }: AppSidebarProps) {
  const handleSignOut = async () => {
    await authClient.signOut()
    window.location.href = ROUTES.LOGIN
  }

  return (
    <AppShell.Navbar p="md">
      <Stack gap="xs" h="100%">
        <Group gap="sm" p="sm">
          <IconBolt size={28} color="var(--mantine-color-teal-6)" />
          <Text fw={800} size="lg">
            EV Station
          </Text>
        </Group>

        <Divider my="xs" />

        <Box style={{ flex: 1 }}>
          <Stack gap={4}>
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                component={Link}
                to={item.href}
                label={item.label}
                leftSection={<item.icon size={20} />}
              />
            ))}

            {isAdmin && (
              <>
                <Divider label="Admin" labelPosition="center" my="xs" />
                {ADMIN_ITEMS.map((item) => (
                  <NavLink
                    key={item.href}
                    component={Link}
                    to={item.href}
                    label={item.label}
                    leftSection={<item.icon size={20} />}
                    color="red"
                  />
                ))}
              </>
            )}
          </Stack>
        </Box>

        <Divider my="xs" />
        <Button
          variant="subtle"
          color="red"
          leftSection={<IconLogout size={18} />}
          onClick={handleSignOut}
          fullWidth
        >
          Sign out
        </Button>
      </Stack>
    </AppShell.Navbar>
  )
}
