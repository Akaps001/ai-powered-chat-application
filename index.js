import { app } from './src/app.js';
import { env } from './src/config/env.js';
import connectDB from './src/config/database.js';
import redisClient from './src/config/redis.js';

// Connect to Database
connectDB();
// Connect to Redis
redisClient.connect();

// Start the server
const port = env.PORT;
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`API documentation available at http://localhost:${port}/documentation`);
});

// Initialize Socket.io
import { initSocket } from './src/config/socket.js';
const io = initSocket(server);

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
