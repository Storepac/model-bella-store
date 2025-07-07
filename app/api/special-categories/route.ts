import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bella_store',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

// Categorias especiais pré-definidas
const SPECIAL_CATEGORIES = [
  {
    name: 'Promoções',
    slug: 'promocoes',
    description: 'Produtos em promoção',
    type: 'promotion',
    color: '#ef4444', // Vermelho
    icon: '🏷️'
  },
  {
    name: 'Lançamentos',
    slug: 'lancamentos', 
    description: 'Produtos recém-lançados',
    type: 'launch',
    color: '#22c55e', // Verde
    icon: '🚀'
  }
]

// GET: buscar status das categorias especiais da loja
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeIdParam = searchParams.get('storeId')
    const storeId = storeIdParam ? Number(storeIdParam) : 1
    
    // Buscar configurações existentes
    const [configs] = await pool.query(`
      SELECT type, isActive, created_at, updated_at
      FROM special_categories 
      WHERE storeId = ?
    `, [storeId])
    
    const configMap = (configs as any[]).reduce((acc, config) => {
      acc[config.type] = config
      return acc
    }, {})
    
    // Combinar com categorias especiais padrão
    const result = SPECIAL_CATEGORIES.map(category => ({
      ...category,
      isActive: configMap[category.type]?.isActive || false,
      created_at: configMap[category.type]?.created_at || null,
      updated_at: configMap[category.type]?.updated_at || null
    }))
    
    return NextResponse.json({ success: true, categories: result })
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao buscar categorias especiais', 
      details: error.message 
    }, { status: 500 })
  }
}

// POST: ativar/desativar categoria especial
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, isActive, storeId: bodyStoreId } = body
    const storeId = bodyStoreId ? Number(bodyStoreId) : 1
    
    if (!type || !SPECIAL_CATEGORIES.find(cat => cat.type === type)) {
      return NextResponse.json({
        success: false,
        error: 'Tipo de categoria especial inválido'
      }, { status: 400 })
    }
    
    // Verificar se já existe configuração
    const [existing] = await pool.query(`
      SELECT id FROM special_categories 
      WHERE storeId = ? AND type = ?
    `, [storeId, type])
    
    if ((existing as any[]).length > 0) {
      // Atualizar existente
      await pool.query(`
        UPDATE special_categories 
        SET isActive = ?, updated_at = NOW()
        WHERE storeId = ? AND type = ?
      `, [isActive, storeId, type])
    } else {
      // Criar novo
      await pool.query(`
        INSERT INTO special_categories (storeId, type, isActive, created_at, updated_at)
        VALUES (?, ?, ?, NOW(), NOW())
      `, [storeId, type, isActive])
    }
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao atualizar categoria especial', 
      details: error.message 
    }, { status: 500 })
  }
}

// PUT: atualizar múltiplas categorias especiais
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { categories, storeId: bodyStoreId } = body
    const storeId = bodyStoreId ? Number(bodyStoreId) : 1
    
    if (!Array.isArray(categories)) {
      return NextResponse.json({
        success: false,
        error: 'Formato inválido: esperado array de categorias'
      }, { status: 400 })
    }
    
    // Atualizar cada categoria
    for (const category of categories) {
      if (!category.type || !SPECIAL_CATEGORIES.find(cat => cat.type === category.type)) {
        continue
      }
      
      // Verificar se já existe
      const [existing] = await pool.query(`
        SELECT id FROM special_categories 
        WHERE storeId = ? AND type = ?
      `, [storeId, category.type])
      
      if ((existing as any[]).length > 0) {
        // Atualizar
        await pool.query(`
          UPDATE special_categories 
          SET isActive = ?, updated_at = NOW()
          WHERE storeId = ? AND type = ?
        `, [category.isActive, storeId, category.type])
      } else {
        // Criar
        await pool.query(`
          INSERT INTO special_categories (storeId, type, isActive, created_at, updated_at)
          VALUES (?, ?, ?, NOW(), NOW())
        `, [storeId, category.type, category.isActive])
      }
    }
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao atualizar categorias especiais', 
      details: error.message 
    }, { status: 500 })
  }
} 
 
 
 