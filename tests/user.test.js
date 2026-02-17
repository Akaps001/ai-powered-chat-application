import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../src/app.js';
import User from '../src/models/user.model.js';
import connectDB from '../src/config/database.js';

beforeAll(async () => {
    await connectDB();
});

afterEach(async () => {
    await User.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('User Endpoints', () => {
    let token;
    let userId;
    const userData = {
        email: 'user@example.com',
        password: 'password123',
        role: 'user',
    };

    beforeEach(async () => {
        // Register a user to get token and id
        const res = await request(app)
            .post('/api/auth/register')
            .send(userData);
        token = res.body.token;
        userId = res.body.user._id;
    });

    describe('GET /api/users', () => {
        it('should get all users', async () => {
            const res = await request(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toBeGreaterThan(0);
        });

        it('should fail without token', async () => {
            const res = await request(app).get('/api/users');
            expect(res.statusCode).toEqual(401);
        });
    });

    describe('GET /api/users/:id', () => {
        it('should get user by id', async () => {
            const res = await request(app)
                .get(`/api/users/${userId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('email', userData.email);
        });

        it('should return 404 for non-existent user', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(app)
                .get(`/api/users/${fakeId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(404);
        });
    });

    describe('PUT /api/users/:id', () => {
        it('should update user', async () => {
            const res = await request(app)
                .put(`/api/users/${userId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ email: 'newemail@example.com' });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('email', 'newemail@example.com');
        });
    });

    describe('DELETE /api/users/:id', () => {
        it('should delete user', async () => {
            const res = await request(app)
                .delete(`/api/users/${userId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(204);

            const check = await User.findById(userId);
            expect(check).toBeNull();
        });
    });
});
