import pkg from "pg";
const { Pool } = pkg;

const {
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASSWORD
} = process.env;

if (!DB_HOST || !DB_NAME || !DB_USER || !DB_PASSWORD) {
  console.error("Missing required DB_* environment variables");
  process.exit(1);
}

export const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT ? Number(DB_PORT) : 5432,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD,
  max: 10,
  idleTimeoutMillis: 30000
});

export async function initDb() {
  // Простая "миграция": создаём таблицу, если её нет
  const createTableSql = `
    CREATE TABLE IF NOT EXISTS notes (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      body TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await pool.query(createTableSql);
  console.log("DB initialized (table notes ensured)");
}
