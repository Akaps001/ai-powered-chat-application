import { createServer } from 'http';
import { Server } from 'socket.io';
import Client from 'socket.io-client';
import jwt from 'jsonwebtoken';
import { env } from '../src/config/env.js';
import User from '../src/models/user.model.js';
import connectDB from '../src/config/database.js';
import mongoose from 'mongoose';
import { jest } from '@jest/globals';

// Setup Mock for ChatService
const mockChatService = {
    createChat: jest.fn(),
    continueChat: jest.fn(),
};

jest.unstable_mockModule('../src/services/chat.service.js', () => ({
    default: mockChatService,
}));

// Import configs after mock
const { initSocket } = await import('../src/config/socket.js');

let io, server, clientSocket, user, token;

beforeAll(async () => {
    await connectDB();
    const httpServer = createServer();
    io = initSocket(httpServer);

    // Start server on a specific port for testing
    await new Promise((resolve) => {
        server = httpServer.listen(0, () => { // 0 lets OS pick random port
            resolve();
        });
    });

    // Create a test user and token
    user = await User.create({
        email: 'socketuser@example.com',
        password: 'password123',
        role: 'user'
    });
    token = jwt.sign({ id: user._id }, env.JWT_SECRET, { expiresIn: '1h' });
});

afterAll(async () => {
    await mongoose.connection.close();
    if (io) io.close();
    if (server) server.close();
});

afterEach(() => {
    if (clientSocket && clientSocket.connected) {
        clientSocket.disconnect();
    }
    jest.clearAllMocks();
});

describe('Socket.io Integration', () => {
    const getSocketUrl = () => {
        const addr = server.address();
        return `http://localhost:${addr.port}`;
    };

    it('should connect with valid token', (done) => {
        clientSocket = Client(getSocketUrl(), {
            auth: { token: token }
        });

        clientSocket.on('connect', () => {
            expect(clientSocket.connected).toBe(true);
            done();
        });
    });

    it('should fail connection without token', (done) => {
        clientSocket = Client(getSocketUrl());

        clientSocket.on('connect_error', (err) => {
            expect(err.message).toBe('Authentication error: Token missing');
            done();
        });
    });

    it('should handle send_message event', (done) => {
        const chatId = 'chat123';
        const message = 'Hello Socket';

        // Mock the service response
        const mockResponse = {
            _id: chatId,
            messages: [
                { role: 'user', content: message },
                { role: 'assistant', content: 'Mocked Response' }
            ]
        };
        mockChatService.continueChat.mockResolvedValue(mockResponse);

        clientSocket = Client(getSocketUrl(), {
            auth: { token: token }
        });

        clientSocket.on('connect', () => {
            clientSocket.emit('join_chat', chatId);

            // Listen for response
            clientSocket.on('receive_message', (data) => {
                expect(data).toEqual(mockResponse);
                expect(mockChatService.continueChat).toHaveBeenCalledWith(chatId, message);
                done();
            });

            // Send message
            clientSocket.emit('send_message', { chatId, content: message });
        });
    });
});
