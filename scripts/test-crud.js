// Script para testar o CRUD completo
// Usa variáveis de ambiente ou fallback para local
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || `${BACKEND_URL}/api`;

// Dados de teste
const TEST_DATA = {
  store: {
    name: 'Loja Teste CRUD',
    email: 'crud@teste.com',
    whatsapp: '11999999999',
    description: 'Loja para testar CRUD completo',
    cnpj: '12345678901234',
    inscricao_estadual: '123456789',
    endereco: 'Rua CRUD, 123',
    instagram: '@lojacrud',
    facebook: 'lojacrud',
    youtube: 'lojacrud',
    horarios: 'Seg-Sex: 9h-18h',
    politicas_troca: 'Troca em até 7 dias',
    politicas_gerais: 'Políticas gerais da loja'
  },
  user: {
    email: 'admin@teste.com',
    password: 'admin123'
  }
};

// Função para fazer requisições
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`🌐 ${options.method || 'GET'} ${url}`);
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  console.log(`📊 Status: ${response.status}`);
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HTTP ${response.status}: ${error}`);
  }

  return response.json();
}

// Função para fazer login
async function login() {
  console.log('\n🔐 Fazendo login...');
  const response = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(TEST_DATA.user)
  });
  
  console.log('✅ Login realizado:', response.data?.user?.tipo);
  return response.data?.token;
}

// Função para testar CREATE
async function testCreate(token) {
  console.log('\n➕ Testando CREATE...');
  
  const response = await apiRequest('/stores', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(TEST_DATA.store)
  });
  
  console.log('✅ Loja criada:', response.data?.id);
  return response.data?.id;
}

// Função para testar READ
async function testRead(token, storeId) {
  console.log('\n📖 Testando READ...');
  
  // Listar todas as lojas
  const listResponse = await apiRequest('/stores/admin', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('✅ Lojas listadas:', listResponse.data?.length || 0);
  
  // Buscar loja específica
  const getResponse = await apiRequest(`/stores/${storeId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('✅ Loja encontrada:', getResponse.data?.name);
  
  return getResponse.data;
}

// Função para testar UPDATE
async function testUpdate(token, storeId) {
  console.log('\n✏️ Testando UPDATE...');
  
  const updateData = {
    name: 'Loja Teste CRUD - Atualizada',
    description: 'Descrição atualizada',
    instagram: '@lojacrud_atualizada'
  };
  
  const response = await apiRequest(`/stores/${storeId}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(updateData)
  });
  
  console.log('✅ Loja atualizada:', response.message);
  return response;
}

// Função para testar DELETE
async function testDelete(token, storeId) {
  console.log('\n🗑️ Testando DELETE...');
  
  const response = await apiRequest(`/stores/${storeId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ id: storeId })
  });
  
  console.log('✅ Loja deletada:', response.message);
  return response;
}

// Função principal para testar CRUD completo
async function testFullCRUD() {
  console.log('🚀 Iniciando testes CRUD completos...\n');
  
  try {
    // 1. Login
    const token = await login();
    if (!token) {
      throw new Error('Falha no login');
    }
    
    // 2. CREATE
    const storeId = await testCreate(token);
    if (!storeId) {
      throw new Error('Falha ao criar loja');
    }
    
    // 3. READ
    const storeData = await testRead(token, storeId);
    
    // 4. UPDATE
    await testUpdate(token, storeId);
    
    // 5. Verificar UPDATE
    await testRead(token, storeId);
    
    // 6. DELETE
    await testDelete(token, storeId);
    
    console.log('\n🎉 Todos os testes CRUD passaram com sucesso!');
    
  } catch (error) {
    console.error('\n❌ Erro nos testes:', error.message);
    process.exit(1);
  }
}

// Executar testes se o script for chamado diretamente
if (require.main === module) {
  testFullCRUD();
}

module.exports = {
  testFullCRUD,
  apiRequest,
  login,
  testCreate,
  testRead,
  testUpdate,
  testDelete
}; 