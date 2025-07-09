import { NextRequest, NextResponse } from 'next/server'
import { apiRequest, testBackendConnection } from '@/lib/database'

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'bella_store',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

// GET: listar marcas da loja (pegar storeId da query string)
export async function GET(request: NextRequest) {
  try {
    // Testar conexão com o backend
    const isConnected = await testBackendConnection();
    
    if (!isConnected) {
      console.log('Backend não disponível, retornando dados mock');
      return NextResponse.json(mockData);
    }

    // Fazer requisição para o backend
    const result = await apiRequest('/apiC:\Users\storepac\Downloads\anderson\model-bella-store-1\app\api\brands\route.ts');
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
} = new URL(request.url)
    const storeIdParam = searchParams.get('storeId')
    const storeId = storeIdParam ? Number(storeIdParam) : 1
    const [brands] = await pool.query('SELECT id, name FROM brands WHERE storeId = ? ORDER BY name ASC', [storeId])
    return NextResponse.json({ success: true, brands })
  } catch (error) {
    console.error('Erro ao buscar marcas:', error)
    return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// POST: criar nova marca
export async function POST(request: NextRequest) {
  try {
    const { name, storeId: bodyStoreId } = await request.json()
    const storeId = bodyStoreId ? Number(bodyStoreId) : 1
    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Nome da marca é obrigatório' }, { status: 400 })
    }
    // Verificar se marca já existe na loja
    const [exists] = await pool.query('SELECT id FROM brands WHERE name = ? AND storeId = ?', [name, storeId])
    if ((exists as any[]).length > 0) {
      return NextResponse.json({ success: false, error: 'Marca já cadastrada' }, { status: 409 })
    }
    const [result] = await pool.query('INSERT INTO brands (name, storeId) VALUES (?, ?)', [name, storeId])
    return NextResponse.json({ success: true, id: (result as any).insertId })
  } catch (error) {
    console.error('Erro ao criar marca:', error)
    return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// PUT: editar marca
export async function PUT(request: NextRequest) {
  try {
    const { id, name, storeId: bodyStoreId } = await request.json()
    const storeId = bodyStoreId ? Number(bodyStoreId) : 1
    if (!id || !name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'ID e nome da marca são obrigatórios' }, { status: 400 })
    }
    // Verificar se marca já existe na loja (exceto a própria)
    const [exists] = await pool.query('SELECT id FROM brands WHERE name = ? AND storeId = ? AND id != ?', [name, storeId, id])
    if ((exists as any[]).length > 0) {
      return NextResponse.json({ success: false, error: 'Marca já cadastrada' }, { status: 409 })
    }
    await pool.query('UPDATE brands SET name = ?, updatedAt = NOW() WHERE id = ? AND storeId = ?', [name, id, storeId])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao atualizar marca:', error)
    return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// DELETE: remover marca
export async function DELETE(request: NextRequest) {
  try {
    const { id, storeId: bodyStoreId } = await request.json()
    const storeId = bodyStoreId ? Number(bodyStoreId) : 1
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID da marca é obrigatório' }, { status: 400 })
    }
    await pool.query('DELETE FROM brands WHERE id = ? AND storeId = ?', [id, storeId])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar marca:', error)
    return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 })
  }
} 