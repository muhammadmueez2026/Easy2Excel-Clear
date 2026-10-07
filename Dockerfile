# Easy2Excel-Clear - Free SnapDeploy Dockerfile

# =========================
# Build Stage
# =========================
FROM node:20-slim AS build

WORKDIR /app

# Frontend dependencies
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

# Backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy source
COPY frontend/ ./frontend/
COPY backend/ ./backend/

# Production frontend API URL
RUN sed -i "s|http://localhost:5000||g" frontend/src/services/api.ts

# Build frontend + backend
RUN cd frontend && npm run build
RUN cd backend && npm run build


# =========================
# Production Stage
# =========================
FROM node:20-slim

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY --from=build /app/backend/package*.json ./backend/
COPY --from=build /app/backend/node_modules ./backend/node_modules
COPY --from=build /app/backend/dist ./backend/dist
COPY --from=build /app/frontend/dist ./frontend/dist

EXPOSE 5000

CMD ["node", "backend/dist/app.js"]
