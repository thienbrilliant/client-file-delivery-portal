import 'dotenv/config';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Client } from 'pg';

const MIGRATION_NAME = '20260815042712_init';
const MIGRATION_FILE = resolve('prisma', 'migrations', MIGRATION_NAME, 'migration.sql');

async function main() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Migration checksum repair is development-only and is blocked in production.');
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required.');
  }

  const migrationSql = await readFile(MIGRATION_FILE);
  const expectedChecksum = createHash('sha256').update(migrationSql).digest('hex');
  const client = new Client({ connectionString: databaseUrl });

  await client.connect();
  try {
    const result = await client.query<{ checksum: string }>(
      'SELECT checksum FROM "_prisma_migrations" WHERE migration_name = $1',
      [MIGRATION_NAME],
    );

    if (result.rowCount !== 1) {
      throw new Error(`Applied migration ${MIGRATION_NAME} was not found in _prisma_migrations.`);
    }

    const currentChecksum = result.rows[0].checksum;
    if (currentChecksum === expectedChecksum) {
      console.log(`Migration ${MIGRATION_NAME} checksum is already correct.`);
      return;
    }

    await client.query(
      'UPDATE "_prisma_migrations" SET checksum = $1 WHERE migration_name = $2',
      [expectedChecksum, MIGRATION_NAME],
    );

    console.log(`Repaired ${MIGRATION_NAME} checksum.`);
    console.log(`Previous: ${currentChecksum}`);
    console.log(`Current:  ${expectedChecksum}`);
  } finally {
    await client.end();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
