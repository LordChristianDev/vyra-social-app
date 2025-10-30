import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dialect: 'postgresql',
	out: './drizzle',
	schema: './src/db/schema.ts',
	dbCredentials: {
		host: process.env.PGHOST!,
		user: process.env.PGUSER!,
		password: process.env.PGPASSWORD!,
		database: process.env.PGDATABASE!,
		ssl: true,
	},
});