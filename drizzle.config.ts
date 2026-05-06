import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'drizzle-kit';

const envPath = resolve(process.cwd(), '.env');

if (existsSync(envPath)) {
  process.loadEnvFile(envPath);
}

const databaseUrl = process.env.DATABASE_URL ?? '';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/infrastructure/database/schema/index.ts',
  out: './drizzle',
  dbCredentials: {
    url: databaseUrl,
  },
  strict: true,
  verbose: true,
});
