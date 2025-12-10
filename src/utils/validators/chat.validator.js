import { z } from 'zod';

export const createChatSchema = z.object({
    content: z.string().min(1),
    model: z.string().optional().default('gpt-4'),
});

export const continueChatSchema = z.object({
    content: z.string().min(1),
});
