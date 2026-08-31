import { defineConfig } from 'vitest/config'

/**
 * The pure modules under server/ only. The Pages runtime and the Discord call
 * are not simulated: what is worth testing here is the parsing and the
 * rendering, and both are ordinary functions.
 */
export default defineConfig({
  test: {
    include: ['server/**/*.test.ts'],
    environment: 'node',
  },
})
