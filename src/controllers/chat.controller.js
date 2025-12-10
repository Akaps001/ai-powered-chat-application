import { chatService } from '../services/index.js';

/**
 * Controller for Chat functionality.
 * Handles interaction with OpenAI service and Chat persistence.
 */
class ChatController {
    /**
     * Starts a new chat session.
     * Takes a message from the user, sends it to OpenAI, and saves the history.
     */
    async createChat(req, res) {
        // req.user is guaranteed to be present because of the 'authenticate' middleware
        const userId = req.user.id;
        const { content, model } = req.body;

        // Service orchestrates the OpenAI call and DB persistence
        const chat = await chatService.createChat(userId, content, model);
        res.status(201).json(chat);
    }

    /**
     * Continues an existing chat session.
     * Appends new message to history before sending to OpenAI to maintain context.
     */
    async continueChat(req, res) {
        const { id } = req.params;
        const { content } = req.body;

        // TODO: Ideally we should verify here that the chat belongs to the user 
        // before even calling the service, although the service or a separate check does it later.

        const chat = await chatService.continueChat(id, content);
        res.json(chat);
    }

    /**
     * Get all chats for the logged-in user.
     */
    async getUserChats(req, res) {
        const userId = req.user.id;
        const chats = await chatService.getUserChats(userId);
        res.json(chats);
    }

    /**
     * Get a specific chat by ID.
     * Includes a security check to ensure users can only view their own chats.
     */
    async getChatById(req, res) {
        const chat = await chatService.findById(req.params.id);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        // Security Check: Verify that the requesting user owns this chat
        if (chat.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        res.json(chat);
    }
}

export default new ChatController();
