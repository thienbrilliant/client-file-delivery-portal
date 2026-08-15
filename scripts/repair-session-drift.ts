import 'dotenv/config';
import { Client } from 'pg';

async function main() {
  if (process.env.NODE_ENV === 'production') throw new Error('Session drift repair is development-only.');
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.');
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    const result = await client.query<{ constraint_name: string }>(`SELECT conname AS constraint_name FROM pg_constraint WHERE conrelid = '"Session"'::regclass AND contype = 'p'`);
    for (const row of result.rows) {
      await client.query(`ALTER TABLE "Session" DROP CONSTRAINT "${row.constraint_name.replace(/"/g, '""')}"`);
      console.log(`Dropped unexpected Session primary key: ${row.constraint_name}`);
    }
    if (!result.rowCount) console.log('No unexpected Session primary key found.');
  } finally { await client.end(); }
}
main().catch((error) => { console.error(error); process.exit(1); });
