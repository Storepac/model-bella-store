# Configuração do Backend no Deploy

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# Configuração do Backend no Deploy
NEXT_PUBLIC_BACKEND_URL=https://backend-e5txym-30bc43-152-53-192-161.traefik.me

# Configuração da API
NEXT_PUBLIC_API_URL=https://backend-e5txym-30bc43-152-53-192-161.traefik.me
BACKEND_URL=https://backend-e5txym-30bc43-152-53-192-161.traefik.me
```

## Configuração do Backend

O backend está configurado no Deploy com as seguintes variáveis:

```env
DB_HOST=bella-mysql
DB_PORT=3306
DB_USER=root
DB_PASSWORD=gzsexpaiz33cirzeorjk2iuhzawiq1na
DB_NAME=bella_store
JWT_SECRET=bella_store_jwt_secret_2025
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=production
```

## Endpoints do Backend

O frontend agora faz requisições para os seguintes endpoints no backend:

- `GET /api/categories` - Listar categorias
- `POST /api/categories` - Criar categoria
- `PUT /api/categories/:id` - Atualizar categoria
- `DELETE /api/categories/:id` - Deletar categoria
- `GET /api/store-data` - Dados da loja
- `GET /api/health` - Health check

## Fallback para Dados Mock

Se o backend não estiver disponível, o frontend retornará dados mock para garantir que a aplicação continue funcionando.

## Como Testar

1. Crie o arquivo `.env.local` com as variáveis acima
2. Reinicie o servidor de desenvolvimento: `pnpm dev`
3. Acesse a aplicação e verifique se as categorias e dados da loja estão sendo carregados
4. Verifique os logs do console para confirmar se está conectando ao backend 