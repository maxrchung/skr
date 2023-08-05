FROM node:18.16.0-alpine

WORKDIR /app

COPY package*.json .
ENV NODE_ENV production
RUN npm ci --omit=dev

COPY . .

EXPOSE 4000

CMD ["node", "index.js"]