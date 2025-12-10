import redisClient from '../config/redis.js';

class CacheService {
    constructor() {
        this.client = redisClient.getInstance();
    }

    /**
     * @param {string} key - The unique label for the data (e.g., "user:123").
     * @returns {Promise<any|null>} - The data if found, or null.
     */
    async get(key) {
        // Safety First: If Redis is down, don't crash the app. Just pretend cache is empty.
        if (!redisClient.isConnected) return null;
        try {
            const value = await this.client.get(key);
            // Redis only stores strings. We have to turn that string back into an Object.
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error(`Cache Get Error [${key}]:`, error);
            // If something weird happens, fail safely so the user gets their data from the DB instead.
            return null;
        }
    }

    /**
     * Set a value in the cache.
     * @param {string} key - Unique label.
     * @param {any} value - The data object to save.
     * @param {number} ttlSeconds - "Time To Live". How long until this info is too old? (Default: 1 hour)
     */
    async set(key, value, ttlSeconds = 3600) {
        // If Redis is down, we skip saving. The app still works, just slower.
        if (!redisClient.isConnected) return;
        try {
            // Redis can't store complex Objects directly. We 'stringify' them into text.
            await this.client.set(key, JSON.stringify(value), {
                EX: ttlSeconds // EX = Expire time in seconds
            });
        } catch (error) {
            console.error(`Cache Set Error [${key}]:`, error);
        }
    }

    /**
     * Delete a value from the cache.
     * @param {string} key 
     */
    async del(key) {
        if (!redisClient.isConnected) return;
        try {
            await this.client.del(key);
        } catch (error) {
            console.error(`Cache Del Error [${key}]:`, error);
        }
    }
}

export default new CacheService();
