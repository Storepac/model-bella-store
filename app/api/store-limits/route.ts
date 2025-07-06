import { NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function GET(request: Request) {
  try {
    // Tentar pegar o storeId da query string
    const { searchParams } = new URL(request.url)
    const storeIdParam = searchParams.get('storeId')
    const storeId = storeIdParam ? Number(storeIdParam) : 1;
    
    // Buscar configurações da loja
    const settings: any = await query(`
      SELECT plano, limite_produtos, limite_fotos_produto 
      FROM settings 
      WHERE storeId = ?
    `, [storeId]);
    
    if (settings.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Configurações da loja não encontradas' 
      }, { status: 404 });
    }
    
    // Contar produtos atuais
    const productCount: any = await query(`
      SELECT COUNT(*) as total 
      FROM products 
      WHERE storeId = ?
    `, [storeId]);
    
    const config = settings[0];
    const currentProducts = productCount[0].total;
    const limitProducts = config.limite_produtos;
    const limitPhotos = config.limite_fotos_produto;
    
    // Calcular percentual usado
    const percentUsed = Math.round((currentProducts / limitProducts) * 100);
    
    // Verificar se pode cadastrar mais
    const canAddProduct = currentProducts < limitProducts;
    
    // Status do limite
    let status = 'ok';
    if (percentUsed >= 100) status = 'exceeded';
    else if (percentUsed >= 80) status = 'warning';
    else if (percentUsed >= 60) status = 'caution';
    
    return NextResponse.json({
      success: true,
      data: {
        plano: config.plano,
        products: {
          current: currentProducts,
          limit: limitProducts,
          remaining: limitProducts - currentProducts,
          percentUsed,
          canAdd: canAddProduct,
          status
        },
        photos: {
          limitPerProduct: limitPhotos
        }
      }
    });
    
  } catch (error) {
    console.error('Erro ao buscar limites:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    }, { status: 500 });
  }
} 