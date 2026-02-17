# AI-Powered Chat Application

A robust **Node.js microservice** built with **Express.js**, designed for scalable AI chat interactions.

## 🏗 System Overview

### Tech Stack
-   **Runtime**: Node.js (v20+)
-   **Framework**: Express.js 5.x
-   **Database**: MongoDB (Mongoose ORM)
-   **Caching**: Redis (Service + Client)
-   **AI**: OpenAI API
-   **Validation**: Zod
-   **Docs**: Swagger (OpenAPI 3.0)

### Architecture
The project follows a **Layered Architecture**:
1.  **Routes** (`src/routes`): Entry points, mapped to controllers.
2.  **Controllers** (`src/controllers`): Handle HTTP requests/responses. Refactored to be thin and async-aware.
3.  **Services** (`src/services`): Business logic (Auth, Chat, User management).
4.  **Repositories** (`src/repositories`): Direct database access.
5.  **Config**: Centralized configuration via `src/config/env.js`.

## ✨ Key Features
-   ✅ **Authentication**: JWT-based auth with secure password hashing (Bcrypt).
-   ✅ **Caching**: Redis caching implemented for User service.
-   ✅ **Validation**: Strict request validation using Zod middlewares.
-   ✅ **Error Handling**: Centralized global error handler.
-   ✅ **Security**: Helmet, CORS, and Rate Limiting enabled.

## 🚀 Getting Started

### Prerequisites
- Node.js v20+
- MongoDB
- Redis

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Akaps001/ai-powered-chat-application.git
    cd ai-powered-chat-application
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory (see `.env.example` or code for required keys):
    - `MONGODB_URI`
    - `REDIS_URL`
    - `OPENAI_API_KEY`
    - `JWT_SECRET`
    - `PORT`

4.  **Run the application**
    ```bash
    # Development
    npm run dev

    # Production
    npm start
    ```

## ☁️ Deployment

Since this app requires **persistent services** (MongoDB, Redis), verify your hosting provider supports them.

**Recommended Providers:**
-   **Railway / Render / Fly.io**: Easy configuration for Node.js + Redis + Mongo.
-   **Docker**: Containerized deployment is now supported.

### Using Docker

1.  **Build and run with Docker Compose**
    ```bash
    docker-compose up --build
    ```
    This will start the Application, MongoDB, and Redis containers.
    The API will be available at `http://localhost:3000`.

## 🚀 Deployment

### Deploy to Render
1.  Host your code on GitHub.
2.  Sign up for [Render](https://render.com/).
3.  Click **New +** -> **Blueprint** -> Connect your repo.
4.  Render will auto-detect `render.yaml`.
5.  **Critical**: You must manually add these Environment Variables in the Render Dashboard:
    - `MONGODB_URI`: Connection string from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
    - `OPENAI_API_KEY`: Your OpenAI Key (Optional if Mock Mode is true).
    - `JWT_SECRET`: A strong secret key.
    - `MOCK_OPENAI`: Set to `true` for portfolio/demo mode (avoids API costs).

### Database Setup (MongoDB Atlas)
Since Render does not provide managed MongoDB:
1.  Create a free account on MongoDB Atlas.
2.  Create a cluster (Shared - M0 Sandbox).
3.  In "Network Access", allow access from anywhere (`0.0.0.0/0`) or find Render's outgoing IPs.
4.  Get the Connection String (driver Node.js 5.5+).

## 🧪 Quality Assurance

### Testing
Run the automated test suite (Jest + Supertest):
```bash
npm test
```

### Linting & Formatting
Check for code quality issues:
```bash
npm run lint
```

Fix automatically fixable issues:
```bash
npm run lint:fix
```

Format code with Prettier:
```bash
npm run format
```
