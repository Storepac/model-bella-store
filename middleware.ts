import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/', '/planos', '/demo', '/login', '/acesso', '/cadastro']

function isPublicPath(path: string) {
  // Permite rotas públicas e suas subrotas
  return (
    path === '/' ||
    path === '/planos' ||
    path === '/login' ||
    path === '/acesso' ||
    path === '/cadastro' ||
    path.startsWith('/demo') ||
    path.startsWith('/categoria') ||
    path.startsWith('/produto') ||
    path.startsWith('/catalogo') ||
    path.startsWith('/sobre') ||
    path.startsWith('/politica') ||
    path.startsWith('/termos') ||
    path.startsWith('/promocoes') ||
    path.startsWith('/lancamentos') ||
    path.startsWith('/categorias') ||
    path.startsWith('/api/') ||
    path.startsWith('/_next') ||
    path.startsWith('/static')
  )
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Permitir acesso às rotas públicas
  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  // Verificar se há token de autenticação nos cookies
  const token = request.cookies.get('token')?.value

  // Se não há token e não é rota pública, redirecionar para login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Se há token, permitir acesso
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|static|favicon.ico).*)']
} 