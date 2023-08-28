FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json remix.config.js remix.env.d.ts schema.prisma tsconfig.json ./
COPY app/ ./app
COPY public/ ./public

RUN npm ci
RUN npm exec remix build

FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json remix.config.js schema.prisma ./
COPY --from=build /app/build ./build
COPY --from=build /app/public ./public
COPY migrations/ ./migrations

RUN npm ci --omit=dev

CMD npm start
