import BaseService from './base.service.js';
import { userRepository } from '../repositories/index.js';
import cacheService from './cache.service.js';

class UserService extends BaseService {
    constructor() {
        super(userRepository);
    }

    async findById(id) {
        const cacheKey = `user:${id}`;

        // 1. Try to get from cache
        const cachedUser = await cacheService.get(cacheKey);
        if (cachedUser) {
            return cachedUser;
        }

        // 2. Fallback to DB
        const user = await super.findById(id);

        // 3. Update cache (TTL 30 mins)
        if (user) {
            await cacheService.set(cacheKey, user, 1800);
        }

        return user;
    }

    // Invalidate cache on update
    async update(id, data) {
        const updatedUser = await super.update(id, data);
        if (updatedUser) {
            await cacheService.del(`user:${id}`);
        }
        return updatedUser;
    }

    // Invalidate cache on delete
    async delete(id) {
        const deleted = await super.delete(id);
        if (deleted) {
            await cacheService.del(`user:${id}`);
        }
        return deleted;
    }
}

export default new UserService();
