# AI-Powered Chat Application

A robust **Node.js microservice** built with **Express.js**, designed for scalable AI chat interactions.

## 🏗 System Overview

### Tech Stack
-   **Runtime**: Node.js (v20+)
-   **Framework**: Express.js 5.x (Stable)
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
-   **Docker**: Containerize for AWS/GCP/Azure.
