import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/', '/planos', '/demo']

function isPublicPath(path: string) {
  // Permite /, /planos, /demo e qualquer subrota de /demo
  return (
    path === '/' ||
    path === '/planos' ||
    path.startsWith('/demo')
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