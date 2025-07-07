import { type NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001' // ajuste a porta se necessário

export async function PUT(request: Request, context: { params: { id: string } }) {
  const { id } = context.params;
  console.log(`[PROXY] Recebido PUT para ID: ${id}`);
  try {
    const body = await request.text();
    console.log('[PROXY] Body recebido:', body);
    const backendRes = await fetch(`${process.env.BACKEND_URL}/api/stores/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    const data = await backendRes.text();
    console.log(`[PROXY] Resposta do Backend (${backendRes.status}): ${data}`);
    return new Response(data, { status: backendRes.status });
  } catch (error) {
    console.error('[PROXY] Erro no proxy:', error);
    return new Response(JSON.stringify({ success: false, message: 'Erro no proxy', error: String(error) }), { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const id = context.params.id
  console.log(`[PROXY] Recebido GET para ID: ${id}`)
  try {
    const res = await fetch(`${BACKEND_URL}/api/stores/${id}`)
    const data = await res.text()
    return new NextResponse(data, {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error(`[PROXY] Erro ao fazer proxy do GET para ID ${id}:`, error)
    return NextResponse.json(
      { success: false, message: 'Erro no proxy da API.' },
      { status: 500 }
    )
  }
} 