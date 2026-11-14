const { Pool } = require('pg');

const pool = new Pool({
  ...(process.env.DATABASE_URL ? { connectionString: process.env.DATABASE_URL } : {}),
  ...(process.env.PGSSL === 'true' ? { ssl: { rejectUnauthorized: false } } : {}),
});

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL pool error', error);
});

async function query(text, values) {
  return pool.query(text, values);
}

async function closeDatabase() {
  await pool.end();
}

module.exports = {
  query,
  closeDatabase,
};
