import { NextRequest, NextResponse } from 'next/server'

// Templates de variantes pré-definidas para diversos nichos
const variantTemplates = [
  // ROUPAS E ACESSÓRIOS
  {
    id: 'tamanho-roupa',
    name: 'Tamanho (Roupas)',
    description: 'Tamanhos padrão para roupas',
    category: 'Roupas',
    type: 'select',
    options: ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG']
  },
  {
    id: 'cor-basica',
    name: 'Cor',
    description: 'Cores básicas',
    category: 'Geral',
    type: 'color',
    options: ['Preto', 'Branco', 'Azul', 'Vermelho', 'Verde', 'Amarelo', 'Rosa', 'Roxo', 'Cinza', 'Marrom']
  },
  {
    id: 'tamanho-sapato',
    name: 'Numeração (Sapatos)',
    description: 'Numeração brasileira de sapatos',
    category: 'Calçados',
    type: 'select',
    options: ['34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45']
  },

  // ALIMENTOS E BEBIDAS
  {
    id: 'peso-gramas',
    name: 'Peso (Gramas)',
    description: 'Peso em gramas',
    category: 'Alimentos',
    type: 'select',
    options: ['50g', '100g', '200g', '250g', '500g', '750g', '1kg', '2kg']
  },
  {
    id: 'volume-liquido',
    name: 'Volume (Líquidos)',
    description: 'Volume para líquidos',
    category: 'Bebidas',
    type: 'select',
    options: ['200ml', '350ml', '500ml', '750ml', '1L', '1.5L', '2L']
  },
  {
    id: 'sabor-doce',
    name: 'Sabor (Doces)',
    description: 'Sabores para doces e sobremesas',
    category: 'Alimentos',
    type: 'select',
    options: ['Chocolate', 'Baunilha', 'Morango', 'Coco', 'Limão', 'Caramelo', 'Frutas Vermelhas']
  },

  // COSMÉTICOS E PERFUMES
  {
    id: 'tonalidade-base',
    name: 'Tonalidade (Base)',
    description: 'Tonalidades para base e corretivo',
    category: 'Cosméticos',
    type: 'select',
    options: ['Muito Claro', 'Claro', 'Médio Claro', 'Médio', 'Médio Escuro', 'Escuro', 'Muito Escuro']
  },
  {
    id: 'volume-perfume',
    name: 'Volume (Perfumes)',
    description: 'Volumes para perfumes',
    category: 'Perfumes',
    type: 'select',
    options: ['15ml', '30ml', '50ml', '75ml', '100ml', '125ml', '200ml']
  },
  {
    id: 'concentracao-perfume',
    name: 'Concentração',
    description: 'Concentração de perfumes',
    category: 'Perfumes',
    type: 'select',
    options: ['EDT (Eau de Toilette)', 'EDP (Eau de Parfum)', 'Parfum', 'Cologne']
  },

  // ELETRÔNICOS
  {
    id: 'memoria-smartphone',
    name: 'Memória (Smartphone)',
    description: 'Capacidade de memória',
    category: 'Eletrônicos',
    type: 'select',
    options: ['32GB', '64GB', '128GB', '256GB', '512GB', '1TB']
  },
  {
    id: 'cor-smartphone',
    name: 'Cor (Eletrônicos)',
    description: 'Cores para eletrônicos',
    category: 'Eletrônicos',
    type: 'select',
    options: ['Preto', 'Branco', 'Prata', 'Dourado', 'Azul', 'Verde', 'Vermelho', 'Rosa']
  },

  // CASA E DECORAÇÃO
  {
    id: 'tamanho-cama',
    name: 'Tamanho (Cama)',
    description: 'Tamanhos de cama',
    category: 'Casa',
    type: 'select',
    options: ['Solteiro', 'Casal', 'Queen', 'King', 'Super King']
  },
  {
    id: 'material-tecido',
    name: 'Material (Tecido)',
    description: 'Tipos de material/tecido',
    category: 'Casa',
    type: 'select',
    options: ['Algodão', 'Poliéster', 'Linho', 'Seda', 'Microfibra', 'Flanela']
  },

  // ESPORTES E FITNESS
  {
    id: 'tamanho-bola',
    name: 'Tamanho (Bolas)',
    description: 'Tamanhos de bolas esportivas',
    category: 'Esportes',
    type: 'select',
    options: ['Tamanho 1', 'Tamanho 2', 'Tamanho 3', 'Tamanho 4', 'Tamanho 5']
  },
  {
    id: 'peso-halter',
    name: 'Peso (Halteres)',
    description: 'Pesos para halteres',
    category: 'Fitness',
    type: 'select',
    options: ['1kg', '2kg', '3kg', '5kg', '8kg', '10kg', '15kg', '20kg']
  },

  // LIVROS E PAPELARIA
  {
    id: 'formato-livro',
    name: 'Formato (Livros)',
    description: 'Formatos de livros',
    category: 'Livros',
    type: 'select',
    options: ['Físico', 'E-book', 'Audiobook']
  },
  {
    id: 'tamanho-papel',
    name: 'Tamanho (Papel)',
    description: 'Tamanhos de papel',
    category: 'Papelaria',
    type: 'select',
    options: ['A4', 'A3', 'A5', 'Carta', 'Ofício']
  },

  // PLANTAS E JARDIM
  {
    id: 'tamanho-vaso',
    name: 'Tamanho (Vaso)',
    description: 'Tamanhos de vasos',
    category: 'Plantas',
    type: 'select',
    options: ['Pequeno (até 15cm)', 'Médio (15-30cm)', 'Grande (30-50cm)', 'Extra Grande (50cm+)']
  },

  // PETS
  {
    id: 'tamanho-pet',
    name: 'Tamanho (Pet)',
    description: 'Tamanhos para pets',
    category: 'Pets',
    type: 'select',
    options: ['PP', 'P', 'M', 'G', 'GG', 'XG']
  },
  {
    id: 'idade-pet',
    name: 'Idade (Pet)',
    description: 'Faixa etária para pets',
    category: 'Pets',
    type: 'select',
    options: ['Filhote', 'Adulto', 'Sênior']
  }
]

export async function GET(request: NextRequest) {
  try {
    // Testar conexão com o backend
    const isConnected = await testBackendConnection();
    
    if (!isConnected) {
      console.log('Backend não disponível, retornando dados mock');
      return NextResponse.json(mockData);
    }

    // Fazer requisição para o backend
    const result = await apiRequest('/apiC:\Users\storepac\Downloads\anderson\model-bella-store-1\app\api\variant-templates\route.ts');
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
    const category = searchParams.get('category')
    
    let filteredTemplates = variantTemplates
    
    // Filtrar por categoria se especificada
    if (category) {
      filteredTemplates = variantTemplates.filter(template => 
        template.category.toLowerCase() === category.toLowerCase()
      )
    }
    
    // Agrupar por categoria
    const groupedTemplates = filteredTemplates.reduce((acc, template) => {
      if (!acc[template.category]) {
        acc[template.category] = []
      }
      acc[template.category].push(template)
      return acc
    }, {} as Record<string, typeof variantTemplates>)
    
    return NextResponse.json({ 
      success: true, 
      templates: filteredTemplates,
      grouped: groupedTemplates,
      categories: [...new Set(variantTemplates.map(t => t.category))]
    })
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao buscar templates de variantes', 
      details: error.message 
    }, { status: 500 })
  }
} 
 
 
 