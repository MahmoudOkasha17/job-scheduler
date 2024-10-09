# Runtime dependencies
FROM docker.io/node:18-alpine AS runtime-deps

USER node
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev

# Build image
FROM docker.io/node:18-alpine AS build

USER node
WORKDIR /usr/src/app

RUN mkdir -p /usr/src/app/dist

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx nest build

# Final image
FROM docker.io/node:18-alpine AS runtime

USER node
WORKDIR /usr/src/app

COPY --from=runtime-deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

CMD ["node", "dist/main.js"]
