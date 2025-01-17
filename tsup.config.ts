import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['main.ts'],
  splitting: true,
  sourcemap: true,
  clean: true,
})