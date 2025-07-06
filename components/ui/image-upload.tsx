"use client"

import { useState, useRef } from "react"
import { Button } from "./button"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
}

export function ImageUpload({ value, onChange, placeholder = "Clique para fazer upload" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(value || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/images', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        onChange(data.url)
      } else {
        console.error('Upload failed')
        setPreview(null)
      }
    } catch (error) {
      console.error('Upload error:', error)
      setPreview(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {preview ? (
        <div className="relative">
          <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200">
            <Image
              src={typeof preview === 'string' && preview.startsWith('data:') ? preview : value || preview}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleRemove}
            className="absolute top-2 right-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? (
            <div className="space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="text-sm text-gray-600">Fazendo upload...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <ImageIcon className="h-8 w-8 mx-auto text-gray-400" />
              <p className="text-sm text-gray-600">{placeholder}</p>
              <Button variant="outline" size="sm" className="mt-2">
                <Upload className="h-4 w-4 mr-2" />
                Escolher Imagem
              </Button>
            </div>
          )}
        </div>
      )}
      <p className="text-xs text-gray-500 text-center">Tamanho recomendado: 600x400px, JPG ou PNG</p>
    </div>
  )
} 