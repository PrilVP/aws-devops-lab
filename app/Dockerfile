FROM node:22-alpine AS base

WORKDIR /usr/src/app

COPY app/package.json ./
RUN npm install --only=production

COPY app/src ./src

ENV NODE_ENV=production
ENV APP_PORT=8080

EXPOSE 8080

CMD ["npm", "start"]
