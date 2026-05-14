const express = require('express');
const router = express.Router();
const db = require('../services/db');
const redis = require('../services/redis');
const authGuard = require('../middleware/authGuard');
const { cacheHitsTotal, cacheMissesTotal } = require('../metrics');
const { v4: uuidv4 } = require('uuid');

router.use(authGuard);

router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const cacheKey = `tasks:${req.user.id}:${page}:${limit}`;

    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      cacheHitsTotal.inc();
      return res.json(JSON.parse(cachedData));
    }

    cacheMissesTotal.inc();
    const result = await db.query(
      'SELECT * FROM tasks WHERE user_id = $1 AND deleted_at IS NULL ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [req.user.id, limit, offset]
    );

    const response = {
      data: result.rows,
      page,
      limit,
    };

    await redis.setEx(cacheKey, 60, JSON.stringify(response));
    res.json(response);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const id = uuidv4();
    const result = await db.query(
      'INSERT INTO tasks (id, user_id, title, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, req.user.id, title, description]
    );

    // Invalidate cache
    const keys = await redis.keys(`tasks:${req.user.id}:*`);
    if (keys.length > 0) await redis.del(keys);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const { title, description, completed } = req.body;
    const result = await db.query(
      'UPDATE tasks SET title = COALESCE($1, title), description = COALESCE($2, description), completed = COALESCE($3, completed), updated_at = NOW() WHERE id = $4 AND user_id = $5 AND deleted_at IS NULL RETURNING *',
      [title, description, completed, req.params.id, req.user.id]
    );

    if (result.rowCount === 0) {
      const err = new Error('Task not found');
      err.status = 404;
      throw err;
    }

    // Invalidate cache
    const keys = await redis.keys(`tasks:${req.user.id}:*`);
    if (keys.length > 0) await redis.del(keys);

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const result = await db.query(
      'UPDATE tasks SET deleted_at = NOW() WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL',
      [req.params.id, req.user.id]
    );

    if (result.rowCount === 0) {
      const err = new Error('Task not found');
      err.status = 404;
      throw err;
    }

    // Invalidate cache
    const keys = await redis.keys(`tasks:${req.user.id}:*`);
    if (keys.length > 0) await redis.del(keys);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
