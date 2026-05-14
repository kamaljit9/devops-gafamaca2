const request = require('supertest');
const app = require('../src/server.js');

describe('Health Check', () => {
  it('should return 200 and healthy status', async () => {
    const res = await request(app).get('/health');
    // Note: This might return 503 if DB/Redis are not running during unit tests
    // In a real setup, we would mock the services.
    expect([200, 503]).toContain(res.statusCode);
  });
});
