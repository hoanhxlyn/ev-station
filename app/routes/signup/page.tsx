import { Box, Container, Paper } from '@mantine/core'
import styles from './page.module.css'
import { SignupPanel } from './signup-panel'

export { signupAction as action } from './actions'
export { signupLoader as loader } from './loader'

export function meta() {
  return [
    { title: 'EV Station | Complete Profile' },
    {
      name: 'description',
      content:
        'Complete your profile to access the EV Station operator portal.',
    },
  ]
}

export default function Signup() {
  return (
    <Box mih="100dvh" pos="relative" className={styles.pageShell}>
      <Box aria-hidden className={styles.bgBlobTopLeft} />
      <Box aria-hidden className={styles.bgBlobTopRight} />

      <Container
        size="sm"
        py={{ base: 'lg', sm: '3xl', lg: '4xl' }}
        pos="relative"
        w="100%"
      >
        <Paper radius="xl" shadow="xl" withBorder className={styles.cardShell}>
          <SignupPanel />
        </Paper>
      </Container>
    </Box>
  )
}
