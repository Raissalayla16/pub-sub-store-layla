FROM node:14
WORKDIR /app
# 1. Copia apenas os arquivos de dependência primeiro
COPY package*.json ./
RUN npm install
# 2. Copia TODOS os arquivos restantes (incluindo rabbitmq-service.js)
COPY . .
CMD ["node", "app.js"]