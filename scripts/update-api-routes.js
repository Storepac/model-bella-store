const fs = require('fs');
const path = require('path');

// Função para atualizar uma rota da API
function updateApiRoute(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Verificar se já foi atualizada
    if (content.includes('apiRequest') || content.includes('testBackendConnection')) {
      console.log(`✅ ${filePath} já foi atualizada`);
      return;
    }
    
    // Substituir imports do mysql
    content = content.replace(
      /import mysql from 'mysql2\/promise'/g,
      "import { apiRequest, testBackendConnection } from '@/lib/database'"
    );
    
    // Substituir configuração do pool
    content = content.replace(
      /const pool = mysql\.createPool\([\s\S]*?\);/g,
      ''
    );
    
    // Adicionar dados mock básicos
    const mockData = `
// Dados mock para quando o backend não estiver disponível
const mockData = {
  success: true,
  data: []
};
`;
    
    // Inserir dados mock após imports
    content = content.replace(
      /import.*?from.*?['"]\n/g,
      (match) => match + mockData
    );
    
    // Atualizar função GET para usar apiRequest
    content = content.replace(
      /export async function GET\(request: NextRequest\) \{[\s\S]*?\}/g,
      `export async function GET(request: NextRequest) {
  try {
    // Testar conexão com o backend
    const isConnected = await testBackendConnection();
    
    if (!isConnected) {
      console.log('Backend não disponível, retornando dados mock');
      return NextResponse.json(mockData);
    }

    // Fazer requisição para o backend
    const result = await apiRequest('/api${filePath.replace('app/api', '').replace('/route.ts', '')}');
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error:', error)
    
    // Se houver erro de conexão, retornar dados mock
    if (error.message.includes('fetch') || error.message.includes('network')) {
      console.log('Erro de conexão detectado, retornando dados mock');
      return NextResponse.json(mockData);
    }
    
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}`
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ ${filePath} atualizada`);
    
  } catch (error) {
    console.error(`❌ Erro ao atualizar ${filePath}:`, error.message);
  }
}

// Função para encontrar todas as rotas da API
function findApiRoutes(dir) {
  const routes = [];
  
  function scanDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (item === 'route.ts') {
        routes.push(fullPath);
      }
    }
  }
  
  scanDirectory(dir);
  return routes;
}

// Executar atualização
const apiDir = path.join(__dirname, '..', 'app', 'api');
const routes = findApiRoutes(apiDir);

console.log(`Encontradas ${routes.length} rotas da API para atualizar:`);

for (const route of routes) {
  updateApiRoute(route);
}

console.log('\nAtualização concluída!'); 