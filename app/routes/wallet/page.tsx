import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Group,
  NumberInput,
  SimpleGrid,
  Stack,
  Table,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconCreditCard, IconPlus, IconRefresh } from '@tabler/icons-react'
import { useFetcher } from 'react-router'
import { WALLET_MESSAGES } from '~/constants/messages'
import {
  VALIDATION_CONSTRAINTS,
  VALIDATION_MESSAGES,
} from '~/constants/validation'
import { formatCurrency, formatDate } from '~/lib/format-utils'
import styles from './page.module.css'
import type { Route } from './+types/page'

export { walletLoader as loader } from './loader'
export { walletAction as action } from './actions'

export function meta() {
  return [
    { title: 'EV Station | Wallet' },
    {
      name: 'description',
      content: 'Manage your EV Station credits and transactions.',
    },
  ]
}

function getTransactionBadge(type: string) {
  switch (type) {
    case 'top-up':
      return { color: 'green', label: 'Top-up' }
    case 'charging-payment':
      return { color: 'blue', label: 'Charging' }
    case 'debt-repayment':
      return { color: 'orange', label: 'Repayment' }
    default:
      return { color: 'gray', label: type }
  }
}

export default function WalletPage({ loaderData }: Route.ComponentProps) {
  const { user, transactions, isInDebt, creditUnit } = loaderData
  const fetcher = useFetcher()
  const isLoading = fetcher.state !== 'idle'

  const topUpForm = useForm({
    initialValues: {
      amount: VALIDATION_CONSTRAINTS.TRANSACTION_MIN_TOP_UP,
    },
    validate: {
      amount: (value) =>
        value < VALIDATION_CONSTRAINTS.TRANSACTION_MIN_TOP_UP
          ? VALIDATION_MESSAGES.TRANSACTION_MIN_TOP_UP
          : null,
    },
  })

  const repayForm = useForm({
    initialValues: {
      amount: Math.abs(user.creditBalance),
    },
    validate: {
      amount: (value) => {
        if (value <= 0) return 'Amount must be positive'
        if (value > Math.abs(user.creditBalance))
          return 'Amount exceeds current debt'
        return null
      },
    },
  })

  const handleTopUp = () => {
    const validation = topUpForm.validate()
    if (validation.hasErrors) return

    fetcher.submit(
      { intent: 'topup', amount: topUpForm.values.amount },
      { method: 'post' },
    )
  }

  const handleRepay = () => {
    const validation = repayForm.validate()
    if (validation.hasErrors) return

    fetcher.submit(
      { intent: 'repay', amount: repayForm.values.amount },
      { method: 'post' },
    )
  }

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
              <IconCreditCard size={22} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text fw={800} lh={1.1} size="lg">
                Wallet
              </Text>
              <Text size="sm" c="dimmed">
                {WALLET_MESSAGES.BALANCE_LABEL}
              </Text>
            </Stack>
          </Group>
        </Group>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" mb="xl">
          <Card radius="xl" p="lg" shadow="sm" className={styles.balanceCard}>
            <Stack gap="sm">
              <Text c="rgba(255,255,255,0.75)" size="sm">
                Current Balance
              </Text>
              <Title order={2} c="white">
                {formatCurrency(user.creditBalance, creditUnit.DIVISOR)}{' '}
                {creditUnit.LABEL}
              </Title>
              {isInDebt && (
                <Badge color="red" variant="light" radius="xl">
                  {WALLET_MESSAGES.IN_DEBT}
                </Badge>
              )}
            </Stack>
          </Card>

          <Card radius="xl" p="lg" withBorder shadow="sm">
            <Stack gap="sm">
              <Text fw={700}>Top Up</Text>
              <Text c="dimmed" size="sm">
                Add credits to your account
              </Text>
              <fetcher.Form method="post">
                <input type="hidden" name="intent" value="topup" />
                <Group gap="sm" align="flex-end">
                  <NumberInput
                    label="Amount (credits)"
                    placeholder="Enter amount"
                    min={VALIDATION_CONSTRAINTS.TRANSACTION_MIN_TOP_UP}
                    step={VALIDATION_CONSTRAINTS.TRANSACTION_MIN_TOP_UP}
                    name="amount"
                    key={topUpForm.key('amount')}
                    {...topUpForm.getInputProps('amount')}
                    w={160}
                  />
                  <Button
                    type="button"
                    onClick={handleTopUp}
                    loading={isLoading}
                    leftSection={<IconPlus size={18} />}
                  >
                    Top Up
                  </Button>
                </Group>
              </fetcher.Form>
            </Stack>
          </Card>
        </SimpleGrid>

        {isInDebt && (
          <Card
            radius="xl"
            p="lg"
            shadow="sm"
            mb="xl"
            className={styles.debtCard}
          >
            <Stack gap="sm">
              <Text fw={700} c="red.7">
                Debt Repayment
              </Text>
              <Text c="dimmed" size="sm">
                Your account has a debt of{' '}
                {formatCurrency(
                  Math.abs(user.creditBalance),
                  creditUnit.DIVISOR,
                )}{' '}
                {creditUnit.LABEL}. Please repay to continue charging.
              </Text>
              <fetcher.Form method="post">
                <input type="hidden" name="intent" value="repay" />
                <Group gap="sm" align="flex-end">
                  <NumberInput
                    label="Repayment amount"
                    placeholder="Enter amount"
                    min={1}
                    max={Math.abs(user.creditBalance)}
                    step={100}
                    name="amount"
                    key={repayForm.key('amount')}
                    {...repayForm.getInputProps('amount')}
                    w={160}
                  />
                  <Button
                    type="button"
                    onClick={handleRepay}
                    loading={isLoading}
                    color="orange"
                    leftSection={<IconRefresh size={18} />}
                  >
                    Repay
                  </Button>
                </Group>
              </fetcher.Form>
            </Stack>
          </Card>
        )}

        <Card radius="xl" p="lg" withBorder shadow="sm">
          <Group justify="space-between" align="flex-start" mb="md">
            <Stack gap={2}>
              <Text fw={700} fz="lg">
                Transaction History
              </Text>
              <Text c="dimmed" size="sm">
                Your recent transactions
              </Text>
            </Stack>
          </Group>

          <Table.ScrollContainer minWidth={600}>
            <Table verticalSpacing="sm" highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Type</Table.Th>
                  <Table.Th>Description</Table.Th>
                  <Table.Th>Date</Table.Th>
                  <Table.Th ta="right">Amount</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {transactions.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={4}>
                      <Text c="dimmed" ta="center" py="md">
                        No transactions yet
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  transactions.map((tx) => {
                    const badge = getTransactionBadge(tx.type)
                    const isPositive = tx.amount > 0
                    return (
                      <Table.Tr key={tx.id}>
                        <Table.Td>
                          <Badge
                            variant="light"
                            color={badge.color}
                            radius="xl"
                          >
                            {badge.label}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{tx.description || '-'}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" c="dimmed">
                            {formatDate(tx.createdAt.getTime())}
                          </Text>
                        </Table.Td>
                        <Table.Td ta="right">
                          <Text
                            fw={600}
                            size="sm"
                            c={isPositive ? 'green.7' : 'red.7'}
                          >
                            {isPositive ? '+' : ''}
                            {formatCurrency(tx.amount, creditUnit.DIVISOR)}{' '}
                            {creditUnit.LABEL}
                          </Text>
                        </Table.Td>
                      </Table.Tr>
                    )
                  })
                )}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Card>
      </Container>
    </Box>
  )
}
