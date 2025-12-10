import { z } from 'zod';

/**
 * Middleware factory for Zod validation
 * @param {z.Schema} schema - Zod schema to validate against
 * @param {string} source - 'body', 'query', or 'params'
 */
export const validate = (schema, source = 'body') => (req, res, next) => {
    try {
        const data = req[source];
        const parsed = schema.parse(data);
        req[source] = parsed; // Replace with validated data
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                statusCode: 400,
                error: 'Bad Request',
                message: 'Validation failed',
                validation: error.errors
            });
        }
        next(error);
    }
};
