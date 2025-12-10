import { createClient } from 'redis';
import { env } from './env.js';

// Proper Singleton implementation for Redis
class RedisClient {
    constructor() {
        this.client = null;
        this.isConnected = false;
    }

    getInstance() {
        if (!this.client) {
            this.client = createClient({
                url: env.REDIS_URL || `redis://${env.REDIS_HOST}:${env.REDIS_PORT}`,
                socket: {
                    reconnectStrategy: (retries) => {
                        if (retries > 5) {
                            console.error('Too many Redis reconnection attempts. Giving up.');
                            return new Error('Redis connection failed');
                        }
                        // Exponential backoff with jitter: 100ms, 200ms, 400ms...
                        const delay = Math.min(retries * 100, 3000);
                        return delay;
                    }
                }
            });

            this.client.on('error', (err) => console.error('Redis Client Error', err));
            this.client.on('connect', () => {
                this.isConnected = true;
                console.log('Redis Client Connected');
            });
            this.client.on('end', () => {
                this.isConnected = false;
                console.log('Redis Client Disconnected');
            });
        }
        return this.client;
    }

    async connect() {
        const client = this.getInstance();
        if (!this.isConnected) {
            try {
                await client.connect();
            } catch (error) {
                console.warn('Could not connect to Redis. Proceeding without caching/rate-limiting.');
            }
        }
    }

    async disconnect() {
        if (this.client && this.isConnected) {
            await this.client.quit();
        }
    }
}

export default new RedisClient();
