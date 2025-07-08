import { NextResponse } from 'next/server'
import { query } from '@/lib/database'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    // Buscar dados da loja juntamente com plano na tabela settings
    const stores = await query(`
      SELECT 
        s.id, 
        s.name, 
        s.logo,
        s.store_code,
        s.description,
        s.cnpj, 
        s.inscricao_estadual,
        s.whatsapp, 
        s.email, 
        s.endereco, 
        s.instagram,
        s.facebook,
        s.youtube,
        s.horarios,
        s.politicas_troca,
        s.politicas_gerais,
        s.isActive, 
        s.createdAt,
        s.updatedAt,
        st.plano AS plan,
        (SELECT COUNT(*) FROM products p WHERE p.storeId = s.id) AS total_products
      FROM stores s
      LEFT JOIN settings st ON st.storeId = s.id
      ORDER BY s.createdAt DESC
    `)
    return NextResponse.json({ success: true, data: stores })
  } catch (error) {
    console.error('Erro ao buscar lojas:', error)
    return NextResponse.json({ success: false, message: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    let { store_code, password, ...rest } = body
    if (store_code) store_code = store_code.trim().toLowerCase()
    if (password) password = password.trim()
    if (!store_code || !password || !rest.name || !rest.cnpj) {
      return NextResponse.json({ success: false, message: 'Campos obrigatórios faltando' }, { status: 400 })
    }
    const hash = await bcrypt.hash(password, 12)
    const endereco = rest.endereco && rest.endereco.trim().length ? rest.endereco : `${rest.rua && rest.numero ? `${rest.rua}, ${rest.numero}` : ''}${rest.bairro ? ` - ${rest.bairro}` : ''}${rest.cidade && rest.uf ? `, ${rest.cidade}/${rest.uf}` : ''}${rest.cep ? ` - CEP: ${rest.cep}` : ''}`
    const result: any = await query(`
      INSERT INTO stores (store_code, codigo, senha, name, description, cnpj, inscricao_estadual, whatsapp, email, endereco, instagram, facebook, youtube, horarios, politicas_troca, politicas_gerais, isActive, createdAt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, true, NOW())`, [store_code, store_code, hash, rest.name, rest.description, rest.cnpj, rest.inscricao_estadual, rest.whatsapp, rest.email, endereco, rest.instagram, rest.facebook, rest.youtube, rest.horarios, rest.politicas_troca, rest.politicas_gerais])
    const storeId = result.insertId
    await query('INSERT INTO settings (storeId, plano, limite_produtos, limite_fotos_produto) VALUES (?,?,?,?)', [storeId, rest.plan, rest.plan === 'Pro' ? 8 : rest.plan === 'Max' ? 10 : 5, rest.plan === 'Pro' ? 3 : rest.plan === 'Max' ? 4 : 2])
    await query('INSERT INTO users (name, email, senha, tipo, storeId) VALUES (?,?,?,?,?)', [rest.name, rest.email || `${store_code}@example.com`, hash, 'admin_loja', storeId])
    return NextResponse.json({ success: true, data: { id: storeId } })
  } catch (error) {
    console.error('Erro ao cadastrar loja:', error)
    return NextResponse.json({ success: false, message: 'Erro interno do servidor' }, { status: 500 })
  }
}

function safeParam(v: unknown): string | null { return v === undefined ? null : String(v) }

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    console.log('Payload recebido no PUT /api/stores:', body)
    let { id, password, name, description, cnpj, inscricao_estadual, whatsapp, email, cep, rua, numero, bairro, cidade, uf, endereco: enderecoTextoEdit, instagram, facebook, youtube, horarios, politicas_troca, politicas_gerais, isActive, plan, store_code, announcement1, announcement2, announcementContact } = body
    if (store_code) store_code = store_code.trim().toLowerCase()
    let endereco = enderecoTextoEdit && enderecoTextoEdit.trim().length ? enderecoTextoEdit : null
    if (!endereco && rua && numero && bairro && cidade && uf && cep) {
      endereco = `${rua}, ${numero} - ${bairro}, ${cidade}/${uf} - CEP: ${cep}`
    }
    const updateParams = [
      safeParam(name),
      safeParam(description),
      safeParam(cnpj),
      safeParam(inscricao_estadual),
      safeParam(whatsapp),
      safeParam(email),
      safeParam(endereco),
      safeParam(instagram),
      safeParam(facebook),
      safeParam(youtube),
      safeParam(horarios),
      safeParam(politicas_troca),
      safeParam(politicas_gerais),
      safeParam(announcement1),
      safeParam(announcement2),
      safeParam(announcementContact),
      isActive,
      id
    ]
    console.log('Parâmetros do update:', updateParams)
    await query(`UPDATE stores SET name=?, description=?, cnpj=?, inscricao_estadual=?, whatsapp=?, email=?, endereco=COALESCE(?, endereco), instagram=?, facebook=?, youtube=?, horarios=?, politicas_troca=?, politicas_gerais=?, announcement1=?, announcement2=?, announcementContact=?, isActive=?, updatedAt=NOW() WHERE id=?`, updateParams)
    // update settings
    await query(`UPDATE settings SET plano=? WHERE storeId=?`, [plan, id])

    // Se senha foi fornecida, atualizar hash nas tabelas
    if (password && password.trim()) {
      const cleanPassword = password.trim()
      const hash = await bcrypt.hash(cleanPassword, 12)
      await query('UPDATE stores SET senha=? WHERE id=?', [hash, id])
      await query('UPDATE users SET senha=? WHERE storeId=? AND tipo="admin_loja"', [hash, id])
    }

    // Garantir que exista usuário admin_loja
    const admins: any = await query('SELECT id FROM users WHERE storeId=? AND tipo="admin_loja"', [id])
    if (admins.length === 0) {
      const pwdHash = password && password.trim() ? await bcrypt.hash(password.trim(), 12) : await bcrypt.hash('123', 12)
      await query('INSERT INTO users (name, email, senha, tipo, storeId) VALUES (?,?,?,?,?)', [name, email || `${store_code || 'loja'}@example.com`, pwdHash, 'admin_loja', id])
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao atualizar loja:', error)
    return NextResponse.json({ success: false, message: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function DELETE(request:Request){
  try{
    const {id}=await request.json();
    if(!id) return NextResponse.json({success:false,message:'id requerido'},{status:400});
    await query('DELETE FROM stores WHERE id=?',[id]);
    return NextResponse.json({success:true});
  }catch(e){
    console.error('Erro ao deletar loja',e);
    return NextResponse.json({success:false,message:'Erro interno'},{status:500});
  }
} 