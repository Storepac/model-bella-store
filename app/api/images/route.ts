import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: 'mkt-img-db',
  api_key: '129883571276333',
  api_secret: 'hiMscg4ZIiwuA1nI-T8dAF7ICN8',
})

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
    const buffer = Buffer.from(bytes)

    // Upload para o Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: 'categorias' }, (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }).end(buffer)
    })

    // @ts-ignore
    const url = uploadResult.secure_url

    return NextResponse.json({ 
      success: true, 
      url
    })
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 