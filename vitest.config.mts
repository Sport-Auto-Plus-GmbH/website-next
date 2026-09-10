import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['test/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'html'],
      // Only the code we actually write tests against — see .ai/quality/TESTING.md.
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/types/**', // type-only, no runtime logic to cover
        'src/components/ui/**', // shadcn/ui — generated via its CLI, treated as vendored infrastructure
        'src/lib/utils.ts', // shadcn's generated `cn()` re-export
        '**/*.d.ts',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
})
