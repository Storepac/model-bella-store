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
    cat.subcategories = await getCategoriesTree(cat.id, storeId)
  }
  return categories
}

export async function GET(request: NextRequest) {
  try {
    const categoriesTree = await getCategoriesTree(null)
    return NextResponse.json(categoriesTree)
  } catch (error: any) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
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
        body.storeId || 1,
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
    const { id, ...updateData } = body
    const fields = []
    const values = []
    for (const key in updateData) {
      fields.push(`\`${key}\` = ?`)
      values.push(updateData[key])
    }
    values.push(id)
    await pool.query(
      `UPDATE categories SET ${fields.join(', ')}, updatedAt = NOW() WHERE id = ?`,
      values
    )
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error updating category:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }
    // Remove subcategorias primeiro
    await pool.query('DELETE FROM categories WHERE parentId = ?', [id])
    await pool.query('DELETE FROM categories WHERE id = ?', [id])
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
} 