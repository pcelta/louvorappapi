FROM node:22-slim

WORKDIR /app

# Install dependencies first so this layer is cached across source changes.
# Native modules (bcrypt, @swc/core) are built/fetched for linux here, which is
# why node_modules is kept inside the container (see the anonymous volume in
# docker-compose) rather than reusing the host's.
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 80

CMD ["npm", "run", "start:dev:docker"]