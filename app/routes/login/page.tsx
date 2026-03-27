import { Box, Container, Group, Paper } from '@mantine/core'
import styles from './page.module.css'
import { LoginLeftPanel } from './left-panel'
import { LoginRightPanel } from './right-panel'

export { loginAction as action } from './actions'

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
  return (
    <Box mih="100vh" pos="relative" className={styles.pageShell}>
      <Box aria-hidden className={styles.bgBlobTopLeft} />
      <Box aria-hidden className={styles.bgBlobTopRight} />

      <Container
        size="xl"
        py={{ base: 'lg', sm: '3xl', lg: '4xl' }}
        pos="relative"
        w={'100%'}
      >
        <Paper
          radius="32px"
          shadow="xl"
          withBorder
          className={styles.cardShell}
        >
          <Group align="stretch" gap={0} wrap="nowrap">
            <LoginLeftPanel />
            <LoginRightPanel />
          </Group>
        </Paper>
      </Container>
    </Box>
  )
}
