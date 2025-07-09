import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Temporariamente desabilitar verificação para debug
  console.log('🔍 Middleware - Rota:', request.nextUrl.pathname)
  
  // Verificar se está acessando rota admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    console.log('🔍 Middleware - Acessando rota admin')
    
    // Para debug, vamos permitir acesso temporariamente
    console.log('🔍 Middleware - Permitindo acesso temporariamente')
    return NextResponse.next()
    
    // Verificar se está logado (comentado temporariamente)
    // const token = request.cookies.get('token')?.value || 
    //               request.headers.get('authorization')?.replace('Bearer ', '')
    // 
    // console.log('🔍 Middleware - Token encontrado:', !!token)
    // 
    // if (!token) {
    //   console.log('🔍 Middleware - Redirecionando para login')
    //   return NextResponse.redirect(new URL('/login', request.url))
    // }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
} 