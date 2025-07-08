FROM node:18-alpine

WORKDIR /app

# Copia os arquivos de dependência
COPY package.json ./
COPY pnpm-lock.yaml ./

# Instala pnpm e dependências
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copia o restante do código
COPY . .

# Build do projeto
RUN pnpm run build

# Expõe a porta
EXPOSE 3000

# Comando para iniciar
CMD ["pnpm", "start"]