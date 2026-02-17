import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../src/app.js';
import User from '../src/models/user.model.js';
import connectDB from '../src/config/database.js';

// Ensure we are connected to the test database
beforeAll(async () => {
    await connectDB();
});

// Clear database after each test to ensure isolation
afterEach(async () => {
    await User.deleteMany({});
});

// Close database connection after all tests
afterAll(async () => {
    await mongoose.connection.close();
});

describe('Auth Endpoints', () => {
    const userData = {
        email: 'test@example.com',
        password: 'password123',
    };

    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send(userData);

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user).toHaveProperty('email', userData.email);
        });

        it('should not register a user with existing email', async () => {
            await User.create(userData);

            const res = await request(app)
                .post('/api/auth/register')
                .send(userData);

            expect(res.statusCode).toEqual(400);
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            await request(app).post('/api/auth/register').send(userData);
        });

        it('should login with valid credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send(userData);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('token');
        });

        it('should not login with invalid password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ ...userData, password: 'wrongpassword' });

            expect(res.statusCode).toEqual(401);
        });
    });
});
