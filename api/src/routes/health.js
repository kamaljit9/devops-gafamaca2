const express = require('express');
const router = express.Router();
const db = require('../services/db');
const redis = require('../services/redis');

router.get('/health', async (req, res) => {
  let dbStatus = 'down';
  let redisStatus = 'down';

  try {
    await db.query('SELECT 1');
    dbStatus = 'up';
  } catch (err) {}

  try {
    await redis.ping();
    redisStatus = 'up';
  } catch (err) {}

  const status = (dbStatus === 'up' && redisStatus === 'up') ? 'healthy' : 'degraded';

  res.status(status === 'healthy' ? 200 : 503).json({
    status,
    db_conn: dbStatus,
    redis_conn: redisStatus,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
