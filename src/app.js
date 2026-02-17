import express from 'express';
import { env } from './config/env.js';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import routes from './routes/index.js';
import errorHandler from './middleware/error.middleware.js';
import rateLimitMiddleware from './middleware/rateLimit.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();

// Global Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, '../public'))); // Adjusted path since file is in src

// Swagger Configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'OpenAI Microservice API',
            description: 'Microservice for OpenAI API integrations',
            version: '1.0.0',
        },
        servers: [
            {
                url: `http://localhost:${env.PORT}`,
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.js'], // Path to the API docs - might need adjustment relative to run context
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Custom Middleware
app.use(rateLimitMiddleware);

// Routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res, next) => { // Added next for standard middleware signature, though not strictly needed here
    res.status(404).json({
        statusCode: 404,
        error: 'Not Found',
        message: `Route ${req.method}:${req.url} not found`,
    });
});

// Error handling
app.use(errorHandler);

export { app };
