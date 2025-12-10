import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/index.js';
import { UnauthorizedError, BadRequestError } from '../utils/errors.js';

class AuthService {
    constructor() {
        this.repository = userRepository;
    }

    async register(data) {
        const existingUser = await this.repository.findByEmail(data.email);
        if (existingUser) {
            throw new BadRequestError('User already exists');
        }

        const user = await this.repository.create(data);
        const token = this.generateToken(user._id);

        return { user, token };
    }

    async login(email, password) {
        const user = await this.repository.findByEmailWithPassword(email);
        if (!user) {
            throw new UnauthorizedError('Invalid credentials');
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            throw new UnauthorizedError('Invalid credentials');
        }

        const token = this.generateToken(user._id);
        return { user, token };
    }

    generateToken(id) {
        return jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '30d',
        });
    }
}

export default new AuthService();
