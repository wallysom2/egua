# Imagem base Node.js
FROM node:20-alpine

# Diretório de trabalho
WORKDIR /app

# Copiar arquivos de configuração primeiro
COPY package*.json ./
COPY tsconfig.json ./
COPY postcss.config.js ./

# Instalar dependências ignorando scripts
RUN npm install --ignore-scripts

# Copiar o resto do código
COPY . .

# Gerar Prisma
RUN npx prisma generate

# Porta que será exposta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "dev"] 