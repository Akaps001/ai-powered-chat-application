import BaseService from './base.service.js';
import { chatRepository } from '../repositories/index.js';
import openai from '../config/openai.js';
import { env } from '../config/env.js';

class ChatService extends BaseService {
    constructor() {
        super(chatRepository);
        this.openai = openai;
    }

    async createChat(userId, messageContent, model = 'gpt-3.5-turbo') {
        // 1. Create initial message object
        const userMessage = { role: 'user', content: messageContent };



        // Mock OpenAI response for testing if enabled
        if (env.MOCK_OPENAI || !this.openai) {
            const chatData = {
                user: userId,
                messages: [
                    userMessage,
                    { role: 'assistant', content: 'This is a mocked response because MOCK_OPENAI is enabled.' }
                ],
                model: model,
                title: messageContent.substring(0, 30) + '...'
            };
            return await this.repository.create(chatData);
        }

        // 2. Call OpenAI API
        try {
            const completion = await this.openai.chat.completions.create({
                messages: [userMessage],
                model: model,
            });

            const assistantMessage = completion.choices[0].message;

            // 3. Save Chat to DB
            const chatData = {
                user: userId,
                messages: [userMessage, assistantMessage],
                model: model,
                title: messageContent.substring(0, 30) + '...'
            };

            return await this.repository.create(chatData);

        } catch (error) {
            console.error('OpenAI Error:', error);
            throw error;
        }
    }

    async continueChat(chatId, messageContent) {
        const chat = await this.repository.findById(chatId);
        if (!chat) throw new Error('Chat not found');

        const userMessage = { role: 'user', content: messageContent };

        if (env.MOCK_OPENAI || !this.openai) {
            chat.messages.push(userMessage);
            chat.messages.push({ role: 'assistant', content: 'This is a mocked response (continue) because MOCK_OPENAI is enabled.' });
            await chat.save();
            return chat;
        }

        // Add user message to history for context
        const messages = [...chat.messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
        }));

        try {
            const completion = await this.openai.chat.completions.create({
                messages: messages,
                model: chat.model,
            });

            const assistantMessage = completion.choices[0].message;

            // Update DB
            chat.messages.push(userMessage);
            chat.messages.push(assistantMessage);
            await chat.save();

            return chat;
        } catch (error) {
            console.error('OpenAI Error:', error);
            throw error;
        }
    }

    async getUserChats(userId) {
        return await this.repository.findByUser(userId);
    }
}

export default new ChatService();
