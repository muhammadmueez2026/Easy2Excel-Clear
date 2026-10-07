# Easy2Excel-Clear
# Production Dockerfile

# =========================
# Build Frontend
# =========================
FROM node:20-slim AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./

# Make frontend use same-origin API in production
RUN sed -i "s|http://localhost:5000||g" src/services/api.ts

RUN npm run build


# =========================
# Build Backend
# =========================
FROM node:20-slim AS backend-build

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install

COPY backend/ ./

RUN npm run build


# =========================
# Production Container
# =========================
FROM node:20-slim

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY --from=backend-build /app/backend/package*.json ./backend/
COPY --from=backend-build /app/backend/node_modules ./backend/node_modules
COPY --from=backend-build /app/backend/dist ./backend/dist

COPY --from=frontend-build /app/frontend/dist ./frontend/dist

EXPOSE 5000

CMD ["node", "backend/dist/app.js"]
