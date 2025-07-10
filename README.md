# Bella Store - Sistema Multi-Loja

## 🚀 Como rodar o projeto

### Pré-requisitos
- Node.js 18+ 
- MySQL 8.0+
- pnpm (recomendado) ou npm

### 1. Frontend (Next.js - Porta 3000)

```bash
# Instalar dependências
pnpm install

# Rodar em desenvolvimento
pnpm dev
# ou
npm run dev

# Acessar
http://localhost:3000
```

### 2. Backend (Express.js - Porta 3001)

```bash
# Navegar para o backend
cd ../bella-store-backend

# Instalar dependências
npm install

# Rodar servidor
npm start
# ou
node src/server.js

# Acessar API
http://localhost:3001
```

### 3. Configuração do Banco

1. Criar banco MySQL: `bella_store`
2. Importar o arquivo: `bella-store-backend/banco_bella_store.sql`
3. Configurar variáveis de ambiente no backend

### 4. URLs de Acesso

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Demo 1 (Moda)**: http://localhost:3000/demo
- **Demo 2 (Eletrônicos)**: http://localhost:3000/demo2
- **Login**: http://localhost:3000/login
- **Dashboard**: http://localhost:3000/dashboard

### 5. Configuração de Portas

- **Frontend**: 3000 (configurado no package.json)
- **Backend**: 3001 (configurado no server.js)
- **Proxy**: APIs do frontend redirecionam para backend via rewrites

### 6. Variáveis de Ambiente

**Frontend** (`env.local`):
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3001/api
BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_ENV=local
```

**Backend** (`.env`):
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=bella_store
JWT_SECRET=seu_jwt_secret
```

### 7. Comandos Úteis

```bash
# Frontend
pnpm dev          # Rodar na porta 3000
pnpm dev:3001     # Rodar na porta 3001
pnpm build        # Build para produção
pnpm start        # Rodar build de produção

# Backend
npm start         # Rodar servidor
npm run dev       # Rodar com nodemon (se configurado)
```

### 8. Estrutura do Projeto

```
anderson/
├── model-bella-store/          # Frontend Next.js (porta 3000)
│   ├── app/                    # Páginas e rotas
│   ├── components/             # Componentes React
│   ├── hooks/                  # Hooks customizados
│   └── package.json
└── bella-store-backend/        # Backend Express.js (porta 3001)
    ├── src/
    │   ├── routes/             # Rotas da API
    │   ├── middleware/         # Middlewares
    │   └── server.js           # Servidor principal
    └── package.json
```

### 9. Funcionalidades

- ✅ Sistema de login/registro
- ✅ Dashboard administrativo
- ✅ Gestão de produtos/categorias
- ✅ Sistema de cupons
- ✅ Upload de imagens
- ✅ Demos funcionais
- ✅ Logo dinâmica
- ✅ Responsividade total
- ✅ Carrinho de compras
- ✅ WhatsApp integration

### 10. Troubleshooting

**Erro de porta em uso:**
```bash
# Verificar portas em uso
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Matar processo se necessário
taskkill /PID <PID> /F
```

**Erro de CORS:**
- Verificar se backend está rodando na porta 3001
- Verificar configuração de CORS no backend

**Erro de banco:**
- Verificar se MySQL está rodando
- Verificar credenciais no .env
- Verificar se banco `bella_store` existe
