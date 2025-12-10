import BaseRepository from './base.repository.js';
import Chat from '../models/chat.model.js';

class ChatRepository extends BaseRepository {
    constructor() {
        super(Chat);
    }

    async findByUser(userId) {
        return await this.model.find({ user: userId }).sort({ createdAt: -1 });
    }

    async addMessage(chatId, message) {
        const chat = await this.model.findById(chatId);
        if (!chat) return null;

        chat.messages.push(message);
        return await chat.save();
    }
}

export default new ChatRepository();
