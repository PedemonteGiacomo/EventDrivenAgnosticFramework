FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
RUN npx tsc -p tsconfig.json
CMD ["node", "dist/index.js"]
