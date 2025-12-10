import express from 'express';
import { env } from './src/config/env.js';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import connectDB from './src/config/database.js';
import redisClient from './src/config/redis.js'; // New import
import routes from './src/routes/index.js';
import errorHandler from './src/middleware/error.middleware.js';
import rateLimitMiddleware from './src/middleware/rateLimit.js';

// Load environment variables
// dotenv.config(); // Loaded via src/config/env.js

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to Database
connectDB();
// Connect to Redis
redisClient.connect();

// Create Express app
const app = express();

// Global Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));

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
  apis: ['./src/routes/*.js'], // Path to the API docs
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

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    statusCode: 404,
    error: 'Not Found',
    message: `Route ${req.method}:${req.url} not found`,
  });
});

// Start the server
const port = env.PORT;
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`API documentation available at http://localhost:${port}/documentation`);
});

// Handle shutdown
['SIGINT', 'SIGTERM'].forEach(signal => {
  process.on(signal, async () => {
    console.log('Shutting down server...');
    await redisClient.disconnect(); // Close Redis
    server.close(() => {
      process.exit(0);
    });
  });
});
