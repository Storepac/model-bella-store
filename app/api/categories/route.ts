import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

// Configuração da conexão com o banco
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // sem senha
  database: 'bella_store',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

// Função recursiva para montar árvore de categorias
async function getCategoriesTree(parentId: number | null = null, storeId: number = 1) {
  const [rows] = await pool.query(
    'SELECT * FROM categories WHERE parentId ' + (parentId === null ? 'IS NULL' : '= ?') + ' AND storeId = ? ORDER BY `order` ASC',
    parentId === null ? [storeId] : [parentId, storeId]
  )
  const categories = rows as any[]
  for (const cat of categories) {
    cat.isActive = Boolean(cat.isActive)
    // Conta produtos diretamente na categoria
    const [prodCountRows] = await pool.query(
      'SELECT COUNT(*) as count FROM products WHERE categoryId = ? AND storeId = ?',
      [cat.id, storeId]
    )
    let total = prodCountRows[0]?.count || 0
    // Soma produtos das subcategorias recursivamente
    cat.subcategories = await getCategoriesTree(cat.id, storeId)
    for (const sub of cat.subcategories) {
      total += sub.productCount || 0
    }
    cat.productCount = total
  }
  return categories
}

export async function GET(request: NextRequest) {
  try {
    // Pegar storeId da query string, default 1
    const { searchParams } = new URL(request.url)
    const storeIdParam = searchParams.get('storeId')
    const storeId = storeIdParam ? Number(storeIdParam) : 1;
    
    const categoriesTree = await getCategoriesTree(null, storeId)
    return NextResponse.json(categoriesTree)
  } catch (error: any) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Pegar storeId do body, default 1
    const storeId = body.storeId ? Number(body.storeId) : 1;
    
    const [result] = await pool.query(
      'INSERT INTO categories (name, description, image, slug, parentId, level, isActive, `order`, storeId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [
        body.name,
        body.description || null,
        body.image || null,
        body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
        body.parentId ? Number(body.parentId) : null,
        body.level || 0,
        body.isActive !== undefined ? body.isActive : 1,
        body.order || 0,
        storeId,
      ]
    )
    return NextResponse.json({ success: true, id: (result as any).insertId }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, storeId: bodyStoreId, ...updateData } = body
    const storeId = bodyStoreId ? Number(bodyStoreId) : 1;
    
    // Verificar se a categoria pertence à loja antes de editar
    const [categoryCheck] = await pool.query('SELECT id FROM categories WHERE id = ? AND storeId = ?', [id, storeId])
    if ((categoryCheck as any[]).length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Categoria não encontrada ou não pertence à sua loja.' 
      }, { status: 404 })
    }
    
    const allowedFields = ['name', 'description', 'image', 'slug', 'parentId', 'level', 'isActive', 'order']
    const fields = []
    const values = []
    for (const key in updateData) {
      if (allowedFields.includes(key)) {
        fields.push(`\`${key}\` = ?`)
        values.push(updateData[key])
      }
    }
    values.push(id)
    values.push(storeId)
    await pool.query(
      `UPDATE categories SET ${fields.join(', ')}, updatedAt = NOW() WHERE id = ? AND storeId = ?`,
      values
    )
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error updating category:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  // Implemente a lógica para deletar uma categoria
  return NextResponse.json({ error: 'Method not implemented' }, { status: 501 })
}