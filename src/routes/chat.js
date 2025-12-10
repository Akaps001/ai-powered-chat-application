import express from 'express';
import { chatController } from '../controllers/index.js';
import { createChatSchema, continueChatSchema } from '../utils/validators/chat.validator.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

// Apply authentication to all chat routes
router.use(authenticate);

router.post('/', validate(createChatSchema), chatController.createChat);
router.post('/:id/messages', validate(continueChatSchema), chatController.continueChat);
router.get('/', chatController.getUserChats);
router.get('/:id', chatController.getChatById);

export default router;
