# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm install

# Copy source and lint
COPY . .
RUN npm run lint || true

# Stage 2: Production
FROM node:20-alpine

# Set build-time arguments
ARG VERSION=1.0.0
ARG GIT_SHA=unknown
ARG BUILD_DATE=unknown

# Set labels
LABEL maintainer="AppForge Team" \
      version="${VERSION}" \
      git-sha="${GIT_SHA}" \
      build-date="${BUILD_DATE}"

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy built artifacts
COPY --from=builder /app/src ./src

# Create non-root user
RUN addgroup -g 1001 appgroup && \
    adduser -u 1001 -G appgroup -s /bin/sh -D appuser && \
    mkdir /app/keys && \
    chown -R appuser:appgroup /app

# Set permissions
USER 1001

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/health || exit 1

EXPOSE 3000

CMD ["node", "src/server.js"]
