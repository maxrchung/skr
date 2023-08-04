FROM node:18.16.0-alpine

WORKDIR /app

COPY frontend/build /app/frontend/build
RUN mkdir /app/backend
COPY backend/package*.json /app/backend

WORKDIR /app/backend

RUN npm ci --omit=dev
COPY backend /app/backend

EXPOSE 3000
EXPOSE 4000

CMD ["node", "index.js"]