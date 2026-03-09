FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

FROM base AS development
CMD ["npm", "run", "dev"]

FROM base AS build
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
CMD ["npm", "run", "start"]