import { defineConfig } from 'vite'
import dotenv from 'dotenv';

dotenv.config({path: '../../.env.development'}); // Load environment variables from the .env file

export default defineConfig({
  test: {
    /* for example, use global to avoid globals imports (describe, test, expect): */
    globals: true,
    setupFiles: 'dotenv/config'
  },
})