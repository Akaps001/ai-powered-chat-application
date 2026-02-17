import { Server } from 'socket.io';
import { socketAuth } from '../middleware/socketAuth.middleware.js';
import { registerChatHandlers } from '../sockets/chat.socket.js';

let io;

export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: '*', // Allow all origins for development
            methods: ['GET', 'POST']
        }
    });

    // Middleware
    io.use(socketAuth);

    // Connection handler
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.user.id}`);

        // Register handlers
        registerChatHandlers(io, socket);

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.user.id}`);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};
