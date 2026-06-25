# Build context is the repo root (see docker-compose: context: .)
FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/package.json
RUN npm install --workspace apps/api

COPY apps/api ./apps/api

WORKDIR /app/apps/api

EXPOSE 80

CMD ["npm", "run", "start:dev:docker"]