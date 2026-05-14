const promBundle = require('express-prom-bundle');
const { Counter, Gauge } = require('prom-client');

const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  includeStatusCode: true,
  includeUp: true,
  customLabels: { service: 'appforge-api' },
  promClient: {
    collectDefaultMetrics: {},
  },
});

// Custom Metrics
const dbPoolSize = new Gauge({
  name: 'db_pool_size',
  help: 'Total number of connections in the database pool',
});

const cacheHitsTotal = new Counter({
  name: 'cache_hits_total',
  help: 'Total number of cache hits',
});

const cacheMissesTotal = new Counter({
  name: 'cache_misses_total',
  help: 'Total number of cache misses',
});

module.exports = {
  metricsMiddleware,
  dbPoolSize,
  cacheHitsTotal,
  cacheMissesTotal,
};
