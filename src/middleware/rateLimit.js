import redisClient from '../config/redis.js';

/**
 * Rate limiting middleware for Express using Redis
 */
const rateLimitMiddleware = async (req, res, next) => {
  // Fail closed or open depending on Redis status
  const client = redisClient.getInstance();
  if (!client || !redisClient.isConnected) {
    return next();
  }

  // Skip rate limiting for specific paths
  if (req.path === '/health' || req.path.startsWith('/documentation')) {
    return next();
  }

  const ip = req.headers['x-forwarded-for'] || req.ip;
  const key = `rate-limit:${ip}:${req.path}`;
  const windowMs = Number(process.env.RATE_LIMIT_TIME_WINDOW || 3600) * 1000;
  const max = Number(process.env.RATE_LIMIT_MAX || 100);

  try {
    const multi = client.multi();
    multi.incr(key);
    multi.ttl(key);

    const results = await multi.exec();
    const current = results[0];
    const ttl = results[1];

    if (current === 1 || ttl === -1) {
      await client.expire(key, Math.ceil(windowMs / 1000));
    }

    res.set('X-RateLimit-Limit', max);
    res.set('X-RateLimit-Remaining', Math.max(0, max - current));
    res.set('X-RateLimit-Reset', Math.floor((Date.now() + (ttl === -1 ? windowMs : ttl * 1000)) / 1000));

    if (current > max) {
      return res.status(429).json({
        statusCode: 429,
        error: 'Too Many Requests',
        message: 'Too many requests, please try again later.'
      });
    }

    next();
  } catch (error) {
    console.error('Rate limiting error:', error);
    next();
  }
};

export default rateLimitMiddleware;
