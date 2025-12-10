import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().transform(Number).default('3000'),

    // Database
    MONGODB_URI: z.string().url(),
    MONGODB_TEST_URI: z.string().url().optional(),

    // Redis
    REDIS_URL: z.string().optional(),
    REDIS_HOST: z.string().default('localhost'),
    REDIS_PORT: z.string().transform(Number).default('6379'),

    // OpenAI
    OPENAI_API_KEY: z.string().min(1, "OpenAI API Key is required"),

    // JWT (Assuming it exists based on auth controller logic)
    JWT_SECRET: z.string().min(1, "JWT Secret is required").optional().default('secret'),
});

// Validate and export the environment
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error('❌ Invalid environment variables:', parsedEnv.error.format());
    process.exit(1);
}

export const env = parsedEnv.data;
