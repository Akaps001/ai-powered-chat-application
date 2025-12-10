import BaseRepository from './base.repository.js';
import User from '../models/user.model.js';

class UserRepository extends BaseRepository {
    constructor() {
        super(User);
    }

    async findByEmail(email) {
        return await this.model.findOne({ email });
    }

    async findByIdWithPassword(id) {
        return await this.model.findById(id).select('+password');
    }

    async findByEmailWithPassword(email) {
        return await this.model.findOne({ email }).select('+password');
    }
}

export default new UserRepository();
