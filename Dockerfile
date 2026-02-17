# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Production stage
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY --from=builder /app/src ./src
COPY --from=builder /app/index.js ./index.js
COPY --from=builder /app/.prettierrc ./.prettierrc
COPY --from=builder /app/eslint.config.js ./eslint.config.js

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
