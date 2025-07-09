// Utilitários para facilitar os testes
export const TEST_CONFIG = {
  // URLs de teste
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backend-e5txym-30bc43-152-53-192-161.traefik.me',
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backend-e5txym-30bc43-152-53-192-161.traefik.me'}/api`,
  
  // Dados de teste
  TEST_STORE: {
    name: 'Loja Teste',
    email: 'teste@loja.com',
    whatsapp: '11999999999',
    description: 'Loja de teste para desenvolvimento',
    cnpj: '12345678901234',
    inscricao_estadual: '123456789',
    endereco: 'Rua Teste, 123',
    instagram: '@lojatest',
    facebook: 'lojatest',
    youtube: 'lojatest',
    horarios: 'Seg-Sex: 9h-18h',
    politicas_troca: 'Troca em até 7 dias',
    politicas_gerais: 'Políticas gerais da loja'
  },
  
  // Usuário de teste
  TEST_USER: {
    email: 'admin@teste.com',
    password: 'admin123'
  }
};

// Função para testar todas as rotas
export const testAllRoutes = async (token: string) => {
  const results = {
    auth: false,
    stores: false,
    products: false,
    categories: false,
    overview: false
  };

  try {
    // Testar autenticação
    const authResponse = await fetch(`${TEST_CONFIG.API_BASE_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    results.auth = authResponse.ok;

    // Testar listar lojas
    const storesResponse = await fetch(`${TEST_CONFIG.API_BASE_URL}/stores`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    results.stores = storesResponse.ok;

    // Testar overview
    const overviewResponse = await fetch(`${TEST_CONFIG.API_BASE_URL}/admin/overview`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    results.overview = overviewResponse.ok;

    // Testar produtos
    const productsResponse = await fetch(`${TEST_CONFIG.API_BASE_URL}/products`);
    results.products = productsResponse.ok;

    // Testar categorias
    const categoriesResponse = await fetch(`${TEST_CONFIG.API_BASE_URL}/categories`);
    results.categories = categoriesResponse.ok;

  } catch (error) {
    console.error('Erro ao testar rotas:', error);
  }

  return results;
};

// Função para criar loja de teste
export const createTestStore = async (token: string) => {
  try {
    const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/stores`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(TEST_CONFIG.TEST_STORE)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Loja de teste criada:', data);
      return data;
    } else {
      const error = await response.text();
      console.error('❌ Erro ao criar loja de teste:', error);
      return null;
    }
  } catch (error) {
    console.error('❌ Erro ao criar loja de teste:', error);
    return null;
  }
};

// Função para limpar dados de teste
export const cleanupTestData = async (token: string) => {
  try {
    // Listar lojas de teste
    const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/stores/admin`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      const data = await response.json();
      const testStores = data.data?.filter((store: any) => 
        store.name?.includes('Teste') || store.email?.includes('teste')
      ) || [];

      // Deletar lojas de teste
      for (const store of testStores) {
        await fetch(`${TEST_CONFIG.API_BASE_URL}/stores/${store.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }

      console.log(`🧹 ${testStores.length} lojas de teste removidas`);
    }
  } catch (error) {
    console.error('❌ Erro ao limpar dados de teste:', error);
  }
};

// Função para fazer login de teste
export const testLogin = async () => {
  try {
    const response = await fetch(`${TEST_CONFIG.API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(TEST_CONFIG.TEST_USER)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Login de teste realizado:', data);
      return data.data?.token;
    } else {
      const error = await response.text();
      console.error('❌ Erro no login de teste:', error);
      return null;
    }
  } catch (error) {
    console.error('❌ Erro no login de teste:', error);
    return null;
  }
}; 