import { NextRequest, NextResponse } from 'next/server'
import { apiRequest, testBackendConnection } from '@/lib/database'

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bella_store',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export async function GET(request: NextRequest) {
  try {
    // Testar conexão com o backend
    const isConnected = await testBackendConnection();
    
    if (!isConnected) {
      console.log('Backend não disponível, retornando dados mock');
      return NextResponse.json(mockData);
    }

    // Fazer requisição para o backend
    const result = await apiRequest('/apiC:\Users\storepac\Downloads\anderson\model-bella-store-1\app\api\coupons\route.ts');
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
    
    const [rows] = await pool.query('SELECT * FROM coupons WHERE storeId = ? ORDER BY createdAt DESC', [storeId])
    return NextResponse.json({ coupons: rows })
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao buscar cupons', details: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Pegar storeId do body, default 1
    const storeId = body.storeId ? Number(body.storeId) : 1
    
    const [result] = await pool.query(
      'INSERT INTO coupons (code, description, discount_type, discount_value, min_order_value, max_uses, expires_at, isActive, storeId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [body.code, body.description, body.discount_type, body.discount_value, body.min_order_value, body.max_uses, body.expires_at, body.isActive !== undefined ? body.isActive : true, storeId]
    )
    return NextResponse.json({ success: true, id: (result as any).insertId }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao criar cupom', details: error.message }, { status: 500 })
  }
}
