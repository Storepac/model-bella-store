'use client';

import { useState } from 'react';
import { testAllRoutes, createTestStore, cleanupTestData, testLogin, TEST_CONFIG } from '@/lib/test-utils';

export default function TestPage() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');

  const runTests = async () => {
    setLoading(true);
    try {
      // 1. Fazer login com fallback
      console.log('🔐 Tentando login com diferentes credenciais...');
      const loginToken = await testLogin();
      setToken(loginToken || '');

      if (!loginToken) {
        setResults({ error: 'Falha no login - nenhuma credencial funcionou' });
        return;
      }

      // 2. Testar todas as rotas
      const routeResults = await testAllRoutes(loginToken);
      setResults(routeResults);

      // 3. Criar loja de teste
      const storeResult = await createTestStore(loginToken);
      setResults((prev: any) => ({ ...prev, testStore: storeResult }));

    } catch (error: any) {
      setResults({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const cleanup = async () => {
    if (!token) return;
    setLoading(true);
    try {
      await cleanupTestData(token);
      setResults((prev: any) => ({ ...prev, cleanup: 'Dados de teste removidos' }));
    } catch (error: any) {
      setResults((prev: any) => ({ ...prev, cleanupError: error.message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🧪 Página de Testes</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Configurações */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">⚙️ Configurações</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Backend URL:</strong> {TEST_CONFIG.BACKEND_URL}</p>
            <p><strong>API Base URL:</strong> {TEST_CONFIG.API_BASE_URL}</p>
            <p><strong>Token:</strong> {token ? '✅ Presente' : '❌ Ausente'}</p>
          </div>
        </div>

        {/* Ações */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">🎯 Ações</h2>
          <div className="space-y-3">
            <button
              onClick={runTests}
              disabled={loading}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? '🔄 Executando...' : '🚀 Executar Testes'}
            </button>
            
            <button
              onClick={cleanup}
              disabled={loading || !token}
              className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
            >
              🧹 Limpar Dados de Teste
            </button>
          </div>
        </div>
      </div>

      {/* Resultados */}
      {Object.keys(results).length > 0 && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">📊 Resultados</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}

      {/* Dados de Teste */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">📝 Dados de Teste</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">🏪 Loja de Teste</h3>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
              {JSON.stringify(TEST_CONFIG.TEST_STORE, null, 2)}
            </pre>
          </div>
          <div>
            <h3 className="font-semibold mb-2">👤 Credenciais de Teste</h3>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
              {JSON.stringify(TEST_CONFIG.TEST_USERS, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      {/* Instruções */}
      <div className="mt-6 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">📋 Instruções</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>O sistema tentará fazer login com diferentes credenciais automaticamente</li>
          <li>Clique em "Executar Testes" para testar todas as funcionalidades</li>
          <li>Verifique os resultados na seção "Resultados"</li>
          <li>Use "Limpar Dados de Teste" para remover dados de teste</li>
          <li>Se houver erros, verifique os logs no console do navegador</li>
        </ol>
      </div>
    </div>
  );
} 