process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// Configuração do backend - prioriza variáveis de ambiente
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || `${BACKEND_URL}/api`;

// Função para fazer requisições ao backend
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  try {
    // Garantir que endpoint comece com '/'
    const normalized = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    // Se o endpoint já começa com /api, usar diretamente
    const url = normalized.startsWith('/api/') 
      ? `${BACKEND_URL}${normalized}`
      : `${API_BASE_URL}${normalized}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Alguns endpoints podem retornar vazio (204)
    if (response.status === 204) return null;
    
    const data = await response.json();
    return data;
  } catch (error) {
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
          return true;
        }
      } catch (_) {
        continue;
      }
    }
    return false;
  } catch (error) {
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