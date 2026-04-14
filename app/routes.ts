import {
  type RouteConfig,
  index,
  route,
  layout,
} from '@react-router/dev/routes'

export default [
  index('routes/home/page.tsx'),
  route('login', 'routes/login/page.tsx'),
  route('signup', 'routes/signup/page.tsx'),
  route('signup/check-email', 'routes/signup/check-email.tsx'),
  route('api/auth/*', 'routes/api.auth.ts'),
  layout('components/app-layout.tsx', [
    route('app', 'routes/dashboard/page.tsx'),
    route('wallet', 'routes/wallet/page.tsx'),
    route('charging', 'routes/charging/page.tsx'),
    route('vehicles', 'routes/vehicles/page.tsx'),
    route('profile', 'routes/profile/page.tsx'),
    route('admin', 'routes/admin/page.tsx'),
    route('admin/users', 'routes/admin/users/page.tsx'),
    route('admin/users/:userId', 'routes/admin/users.$userId/page.tsx'),
  ]),
] satisfies RouteConfig
