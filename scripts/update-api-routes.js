const fs = require('fs')
const path = require('path')

// Função para atualizar uma rota da API
function updateApiRoute(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    
    // Verificar se já foi atualizada
    if (content.includes('// Dados mock para quando o backend não estiver disponível')) {
      return
    }

    // Adicionar dados mock no final do arquivo
    const mockData = `

// Dados mock para quando o backend não estiver disponível
const mockData = {
  success: true,
  data: []
}

// Verificar se o backend está disponível
async function checkBackendAvailability() {
  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001'
    const response = await fetch(\`\${backendUrl}/health\`, { 
      method: 'GET',
      signal: AbortSignal.timeout(3000) // 3 segundos timeout
    })
    return response.ok
  } catch (error) {
    return false
  }
}

// Função principal modificada
export async function GET(request) {
  try {
    const isBackendAvailable = await checkBackendAvailability()
    
    if (!isBackendAvailable) {
      return NextResponse.json(mockData)
    }

    // Código original para buscar do backend
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Token não fornecido' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    
    try {
      const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001'
      const response = await fetch(\`\${backendUrl}\${request.url.split('/api')[1]}\`, {
        headers: {
          'Authorization': \`Bearer \${token}\`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        return NextResponse.json(data)
      }
    } catch (error) {
      // Se o backend não estiver disponível, retornar dados mock
    }

    return NextResponse.json(mockData)
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
`

    // Encontrar a última função export
    const lines = content.split('\n')
    let lastExportIndex = -1
    
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].includes('export async function')) {
        lastExportIndex = i
        break
      }
    }

    if (lastExportIndex !== -1) {
      // Encontrar o final da função
      let braceCount = 0
      let functionEndIndex = lastExportIndex
      
      for (let i = lastExportIndex; i < lines.length; i++) {
        if (lines[i].includes('{')) braceCount++
        if (lines[i].includes('}')) {
          braceCount--
          if (braceCount === 0) {
            functionEndIndex = i
            break
          }
        }
      }

      // Inserir o novo código após a função
      const newContent = [
        ...lines.slice(0, functionEndIndex + 1),
        mockData,
        ...lines.slice(functionEndIndex + 1)
      ].join('\n')

      fs.writeFileSync(filePath, newContent)
    }
  } catch (error) {
    console.error(`❌ Erro ao atualizar ${filePath}:`, error.message)
  }
}

// Encontrar todas as rotas da API
const apiDir = path.join(__dirname, '..', 'app', 'api')
const routes = []

function findApiRoutes(dir) {
  const items = fs.readdirSync(dir)
  
  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)
    
    if (stat.isDirectory()) {
      findApiRoutes(fullPath)
    } else if (item === 'route.ts' || item === 'route.js') {
      routes.push(fullPath)
    }
  }
}

if (fs.existsSync(apiDir)) {
  findApiRoutes(apiDir)
  
  console.log(`Encontradas ${routes.length} rotas da API para atualizar:`)
  
  for (const route of routes) {
    const relativePath = path.relative(path.join(__dirname, '..'), route)
    console.log(`  - ${relativePath}`)
    updateApiRoute(route)
  }
  
  console.log('\nAtualização concluída!')
} else {
  console.log('❌ Diretório de API não encontrado')
} 