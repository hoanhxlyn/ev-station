import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
  index('routes/home/page.tsx'),
  route('app', 'routes/dashboard/page.tsx'),
  route('login', 'routes/login/page.tsx'),
  route('signup', 'routes/signup/page.tsx'),
  route('signup/check-email', 'routes/signup/check-email.tsx'),
  route('api/auth/*', 'routes/api.auth.ts'),
] satisfies RouteConfig
