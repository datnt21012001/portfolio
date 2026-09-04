import { defineConfig } from 'vitest/config'

/**
 * The pure modules under server/, plus the locale data under src/data. The Pages
 * runtime and the Discord call are not simulated, and neither is a browser: what
 * is worth testing is the parsing, the rendering, and that the two translations
 * stay the same shape. All of it is ordinary functions.
 */
export default defineConfig({
  test: {
    include: ['server/**/*.test.ts', 'src/**/*.test.ts'],
    environment: 'node',
  },
})
