process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// Remover BACKEND_URL antigo e adicionar API_BASE_URL
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backend-e5txym-30bc43-152-53-192-161.traefik.me';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || `${BACKEND_URL}/api`;

// Função para fazer requisições ao backend
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  try {
    // Garantir que endpoint comece com '/'
    const normalized = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const response = await fetch(`${API_BASE_URL}${normalized}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Alguns endpoints podem retornar vazio (204)
    if (response.status === 204) return null;
    return await response.json();
  } catch (error) {
    console.error('Erro na requisição para o backend:', error);
    throw error;
  }
};

// Função para testar conexão com o backend
export const testBackendConnection = async () => {
  try {
    const testEndpoints = ['/health', '/categories'];

    for (const endpoint of testEndpoints) {
      try {
        const res = await fetch(`${API_BASE_URL}${endpoint}`);
        if (res.ok || res.status === 404) {
          console.log(`Backend disponível (testado em ${endpoint})`);
          return true;
        }
      } catch (_) {
        continue;
      }
    }
    return false;
  } catch (error) {
    console.error('Erro de conexão com o backend:', error);
    return false;
  }
};

// Mantendo compatibilidade com código existente
export const query = async (sql: string, params?: any[]) => {
  throw new Error('Use apiRequest para conectar ao backend');
};

export const testConnection = async () => {
  return await testBackendConnection();
};

// Pool vazio para compatibilidade
const pool = {
  query: query,
  getConnection: () => Promise.reject(new Error('Use apiRequest para conectar ao backend')),
  execute: query,
};

export default pool; 