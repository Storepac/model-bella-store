const mysql = require('mysql2/promise')

// Configuração do banco
const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'bella_store',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

// Função para gerar slug a partir do nome
function generateSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .trim()
}

async function addSlugsToProducts() {
  try {
    console.log('🔄 Iniciando adição de slugs aos produtos...')
    
    // Buscar todos os produtos sem slug
    const [products] = await pool.query(`
      SELECT id, name, storeId 
      FROM products 
      WHERE slug IS NULL OR slug = ''
    `)
    
    console.log(`📦 Encontrados ${products.length} produtos sem slug`)
    
    for (const product of products) {
      // Gerar slug baseado no nome
      const baseSlug = generateSlug(product.name)
      let slug = baseSlug
      let counter = 1
      
      // Verificar se slug já existe e criar um único
      while (true) {
        const [existingSlug] = await pool.query(
          'SELECT id FROM products WHERE slug = ? AND storeId = ? AND id != ?', 
          [slug, product.storeId, product.id]
        )
        if (existingSlug.length === 0) {
          break
        }
        slug = `${baseSlug}-${counter}`
        counter++
      }
      
      // Atualizar produto com slug
      await pool.query(
        'UPDATE products SET slug = ? WHERE id = ?',
        [slug, product.id]
      )
      
      console.log(`✅ Produto "${product.name}" -> slug: "${slug}"`)
    }
    
    console.log('🎉 Slugs adicionados com sucesso!')
    
  } catch (error) {
    console.error('❌ Erro ao adicionar slugs:', error)
  } finally {
    await pool.end()
  }
}

// Executar script
addSlugsToProducts() 