# Build stage for React client
FROM node:20-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci --prefer-offline --no-audit
COPY client/ ./
RUN npm run build

# Build stage for TypeScript server
FROM node:20-alpine AS server-build
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm ci --prefer-offline --no-audit
COPY src/ ./src/
COPY config/ ./config/
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --only=production --prefer-offline --no-audit

# Copy compiled server code
COPY --from=server-build /app/dist ./dist

# Copy built React client
COPY --from=client-build /app/client/dist ./client/dist

# Debug: Verify files are copied correctly
RUN echo "📦 Checking build artifacts..." && \
    ls -la dist/ && \
    ls -la dist/src/ && \
    echo "📦 Checking client files..." && \
    ls -la client/dist/ && \
    echo "✅ All files present!"

# Set environment
ENV NODE_ENV=production

# Expose port 4000 (matching your app.ts)
EXPOSE 4000

# Start the application
CMD ["node", "dist/src/app.js"]