import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

function cssModulesMock() {
  return {
    name: 'css-modules-mock',
    enforce: 'pre' as const,
    resolveId(source: string) {
      if (source.endsWith('.module.css')) {
        return `\0mock:${source}`
      }
      return null
    },
    load(id: string) {
      if (id.startsWith('\0mock:')) {
        return 'export default new Proxy({}, { get: (_, p) => typeof p === "string" ? p : "" })'
      }
      return null
    },
  }
}

export default defineConfig({
  plugins: [cssModulesMock(), react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./app/test/setup.ts'],
    include: ['app/**/*.test.{ts,tsx}'],
  },
})
