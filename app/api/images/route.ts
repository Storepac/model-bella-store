import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const filename = searchParams.get('filename')
  
  if (!filename) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 })
  }

  try {
    const imagePath = path.join(process.cwd(), 'public', 'imgs', filename)
    
    if (!fs.existsSync(imagePath)) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    const imageBuffer = fs.readFileSync(imagePath)
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000',
      },
    })
  } catch (error) {
    console.error('Error serving image:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = new Uint8Array(bytes)
    
    // Generate sequential filename
    const imagesDir = path.join(process.cwd(), 'public', 'imgs')
    const existingFiles = fs.readdirSync(imagesDir).filter(f => f.startsWith('img_') && f.endsWith('.jpg'))
    
    let nextNumber = 1
    if (existingFiles.length > 0) {
      const numbers = existingFiles.map(f => {
        const match = f.match(/img_(\d+)\.jpg/)
        return match ? parseInt(match[1]) : 0
      })
      nextNumber = Math.max(...numbers) + 1
    }
    
    const filename = `img_${nextNumber}.jpg`
    const imagePath = path.join(imagesDir, filename)
    
    fs.writeFileSync(imagePath, buffer)
    
    return NextResponse.json({ 
      success: true, 
      filename,
      url: `/api/images?filename=${filename}`
    })
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 