const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('Unexpected database error:', err.message);
});

pool.on('connect', () => {
  console.log('Database connected successfully');
});

// Test connection on startup
pool.query('SELECT NOW()').then(r => {
  console.log('DB connection verified:', r.rows[0].now);
}).catch(err => {
  console.error('DB connection failed:', err.message);
  console.error('DB_URL configured:', !!process.env.DB_URL);
});

module.exports = pool;