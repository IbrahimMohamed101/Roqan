import "server-only";

import { Pool, type QueryResultRow } from "pg";

let pool: Pool | undefined;

export const hasDatabaseUrl = () => Boolean(process.env.DATABASE_URL);

export const getPool = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
    });
  }

  return pool;
};

export const query = async <T extends QueryResultRow>(
  text: string,
  params: unknown[] = [],
) => getPool().query<T>(text, params);
