const { Pool } = require('pg');
const { logger } = require('../middleware/logger');
const { dbPoolSize } = require('../metrics');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.on('connect', () => {
  dbPoolSize.inc();
});

pool.on('remove', () => {
  dbPoolSize.dec();
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
