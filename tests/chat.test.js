import { jest } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import connectDB from '../src/config/database.js';
import User from '../src/models/user.model.js';

// Mock ChatService
const mockChatService = {
    createChat: jest.fn(),
    continueChat: jest.fn(),
    getUserChats: jest.fn(),
    findById: jest.fn(),
};

jest.unstable_mockModule('../src/services/chat.service.js', () => ({
    default: mockChatService,
}));

// Import app after mocking
const { app } = await import('../src/app.js');

beforeAll(async () => {
    await connectDB();
});

afterEach(async () => {
    await User.deleteMany({});
    jest.clearAllMocks();
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Chat Endpoints', () => {
    let token;
    let userId;
    const userData = { email: 'chatuser@example.com', password: 'password123' };

    beforeEach(async () => {
        // Register user
        const res = await request(app).post('/api/auth/register').send(userData);
        token = res.body.token;
        userId = res.body.user._id;
    });

    describe('POST /api/chats', () => {
        it('should create a new chat', async () => {
            const mockChat = { _id: 'chat123', messages: [], user: userId };
            mockChatService.createChat.mockResolvedValue(mockChat);

            const res = await request(app)
                .post('/api/chats')
                .set('Authorization', `Bearer ${token}`)
                .send({ content: 'Hello AI' });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toEqual(mockChat);
            expect(mockChatService.createChat).toHaveBeenCalledWith(userId, 'Hello AI', 'gpt-3.5-turbo');
        });
    });

    describe('POST /api/chats/:id/messages', () => {
        it('should continue a chat', async () => {
            const mockChat = { _id: 'chat123', messages: [{ role: 'user', content: 'new msg' }] };
            mockChatService.continueChat.mockResolvedValue(mockChat);

            const res = await request(app)
                .post('/api/chats/chat123/messages')
                .set('Authorization', `Bearer ${token}`)
                .send({ content: 'Continue please' });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockChat);
            expect(mockChatService.continueChat).toHaveBeenCalledWith('chat123', 'Continue please');
        });
    });

    describe('GET /api/chats', () => {
        it('should get user chats', async () => {
            const mockChats = [{ _id: 'chat1' }, { _id: 'chat2' }];
            mockChatService.getUserChats.mockResolvedValue(mockChats);

            const res = await request(app)
                .get('/api/chats')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockChats);
            expect(mockChatService.getUserChats).toHaveBeenCalledWith(userId);
        });
    });

    // Note: GET /api/chats/:id requires the service to return a chat AND the controller checks ownership.
    // Implementation of getChatById in controller:
    // const chat = await chatService.findById(req.params.id);
    // if (chat.user.toString() !== req.user.id) ...
    // So our mock must return an object with a `user` property that matches userId or has a toString method.

    describe('GET /api/chats/:id', () => {
        it('should get chat by id if authorized', async () => {
            const mockChat = {
                _id: 'chat123',
                user: { toString: () => userId } // Mocking mongoose ObjectId behavior
            };
            mockChatService.findById.mockResolvedValue(mockChat);

            const res = await request(app)
                .get('/api/chats/chat123')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body._id).toEqual(mockChat._id);
        });

        it('should return 403 if not owner', async () => {
            const mockChat = {
                _id: 'chat123',
                user: { toString: () => 'otherUserId' }
            };
            mockChatService.findById.mockResolvedValue(mockChat);

            const res = await request(app)
                .get('/api/chats/chat123')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(403);
        });
    });
});
