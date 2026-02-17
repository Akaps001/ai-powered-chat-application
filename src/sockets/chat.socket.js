import { chatService } from '../services/index.js';

export const registerChatHandlers = (io, socket) => {
    // Join a specific chat room
    socket.on('join_chat', (chatId) => {
        socket.join(chatId);
        console.log(`User ${socket.user.id} joined chat ${chatId}`);
    });

    // Leave a chat room
    socket.on('leave_chat', (chatId) => {
        socket.leave(chatId);
        console.log(`User ${socket.user.id} left chat ${chatId}`);
    });

    // Handle new message
    socket.on('send_message', async ({ chatId, content }) => {
        try {
            // 1. Save user message and get AI response via service
            // Note: chatService.continueChat returns the updated chat object
            const updatedChat = await chatService.continueChat(chatId, content);

            // 2. Emit the updated chat (or just the new messages) to everyone in the room
            // In a real app, strict ownership/participant checks should be done here or in service
            io.to(chatId).emit('receive_message', updatedChat);

        } catch (error) {
            socket.emit('error', { message: error.message });
        }
    });

    // Typing indicator
    socket.on('typing', (chatId) => {
        socket.to(chatId).emit('user_typing', { userId: socket.user.id });
    });
};
