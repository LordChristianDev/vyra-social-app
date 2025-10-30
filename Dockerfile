# =========================================================
# 🧱 Build stage for React client
# =========================================================
FROM node:20-alpine AS client-build
WORKDIR /app

COPY . .
RUN grep '^VITE_' .env > client/.env || true

WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci --prefer-offline --no-audit
RUN npm run build

# =========================================================
# 🧱 Build stage for TypeScript server
# =========================================================
FROM node:20-alpine AS server-build
WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
RUN npm ci --prefer-offline --no-audit
COPY src/ ./src/
COPY config/ ./config/
RUN npm run build

# =========================================================
# 🚀 Production stage
# =========================================================
FROM node:20-alpine
WORKDIR /app

# ✅ Add SSL certs so Node can talk to Neon
RUN apk add --no-cache ca-certificates

COPY package*.json ./
RUN npm ci --only=production --prefer-offline --no-audit

COPY --from=server-build /app/dist ./dist
COPY --from=client-build /app/client/dist ./client/dist

ENV NODE_ENV=production
EXPOSE 4000

CMD ["node", "dist/src/app.js"]