import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const {
	PGHOST,
	PGDATABASE,
	PGUSER,
	PGPASSWORD
} = process.env;

const sql = neon(
	`postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require&channel_binding=require`
);

export const db = drizzle(sql);