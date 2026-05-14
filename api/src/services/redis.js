const { createClient } = require('redis');
const { logger } = require('../middleware/logger');

const client = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

client.on('error', (err) => logger.error('Redis Client Error', err));

(async () => {
  try {
    await client.connect();
    logger.info('Connected to Redis');
  } catch (err) {
    logger.error('Failed to connect to Redis', err);
  }
})();

module.exports = client;
