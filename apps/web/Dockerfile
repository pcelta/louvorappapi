# Build context is the repo root (see docker-compose: context: .)
FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/package.json
RUN npm install --workspace apps/web

COPY apps/web ./apps/web

WORKDIR /app/apps/web

EXPOSE 5173

CMD ["npm", "run", "dev"]