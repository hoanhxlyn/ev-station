export const DASHBOARD_MESSAGES = {
  TITLE: 'Dashboard',
  WELCOME: 'Welcome back',
  CHARGING_CHART_TITLE: 'Charging sessions',
  CHARGING_CHART_SUBTITLE: 'Last 7 days',
  CREDIT_TITLE: 'Credit balance',
  CREDIT_REMAINING: 'remaining',
  RECENT_STATIONS_TITLE: 'Recent stations',
  RECENT_STATIONS_SUBTITLE: 'Your latest charging activity',
  UNAUTHENTICATED: 'Please log in to view your dashboard',
} as const

export const CREDIT_UNIT = {
  LABEL: 'credits',
  DIVISOR: 100,
} as const

export const PAGINATION = {
  DASHBOARD_SESSIONS_LIMIT: 10,
  CHARGING_SESSIONS_LIMIT: 10,
  WALLET_TRANSACTIONS_LIMIT: 50,
  ADMIN_USER_TRANSACTIONS_LIMIT: 20,
  ADMIN_USER_SESSIONS_LIMIT: 20,
  ADMIN_USERS_PAGE_SIZE: 20,
} as const

export const MOCK_CHARGING_DATA = [
  { day: 'Mon', sessions: 2 },
  { day: 'Tue', sessions: 5 },
  { day: 'Wed', sessions: 3 },
  { day: 'Thu', sessions: 7 },
  { day: 'Fri', sessions: 4 },
  { day: 'Sat', sessions: 6 },
  { day: 'Sun', sessions: 1 },
] as const

export const MOCK_CREDIT = {
  balance: 124.5,
  currency: 'USD',
  lastTopUp: '2026-03-28',
} as const

export const MOCK_RECENT_STATIONS = [
  {
    id: '1',
    name: 'Downtown Hub',
    address: '123 Main St',
    date: '2026-04-01',
    duration: '42 min',
    energy: '28.4 kWh',
    cost: '$8.52',
  },
  {
    id: '2',
    name: 'Riverside Lot',
    address: '456 River Rd',
    date: '2026-03-30',
    duration: '35 min',
    energy: '22.1 kWh',
    cost: '$6.63',
  },
  {
    id: '3',
    name: 'Airport Express',
    address: '789 Terminal Ave',
    date: '2026-03-28',
    duration: '58 min',
    energy: '41.7 kWh',
    cost: '$12.51',
  },
  {
    id: '4',
    name: 'Central Park Station',
    address: '321 Park Blvd',
    date: '2026-03-26',
    duration: '27 min',
    energy: '18.9 kWh',
    cost: '$5.67',
  },
  {
    id: '5',
    name: 'Westside Mall',
    address: '654 Commerce Dr',
    date: '2026-03-24',
    duration: '45 min',
    energy: '32.5 kWh',
    cost: '$9.75',
  },
] as const
