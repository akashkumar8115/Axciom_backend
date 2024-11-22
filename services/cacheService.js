const Redis = require('ioredis');
const logger = require('../utils/logger');

class CacheService {
    constructor() {
        this.redis = new Redis({
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            password: process.env.REDIS_PASSWORD
        });

        this.redis.on('error', (error) => {
            logger.error('Redis connection error:', error);
        });
    }

    async set(key, value, expiration = 3600) {
        try {
            await this.redis.set(key, JSON.stringify(value), 'EX', expiration);
            return true;
        } catch (error) {
            logger.error('Cache set error:', error);
            return false;
        }
    }

    async get(key) {
        try {
            const value = await this.redis.get(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            logger.error('Cache get error:', error);
            return null;
        }
    }
}

module.exports = new CacheService();
