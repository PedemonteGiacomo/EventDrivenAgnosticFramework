# packages/services/order-processor/Dockerfile
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev \
 && npm install --no-save typescript

COPY . .
RUN npx tsc -p tsconfig.json

CMD ["node", "dist/index.js"]
