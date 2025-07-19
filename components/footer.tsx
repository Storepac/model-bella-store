"use client"

import { useEffect } from 'react'
import Link from 'next/link'
import { Facebook, Instagram, Youtube, MessageCircle } from 'lucide-react'
import { useStoreData } from '@/hooks/use-store-data'

// Ícone do TikTok (não existe no Lucide, vamos criar um simples)
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V7.56a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.05z"/>
  </svg>
)

export function Footer() {
  const { storeData, loading } = useStoreData()

  if (loading || !storeData) {
    return (
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-6 w-1/3 bg-gray-700 rounded mb-4"></div>
            <div className="h-4 w-2/3 bg-gray-700 rounded"></div>
          </div>
        </div>
      </footer>
    )
  }

  const formatCNPJ = (cnpj: string) => {
    if (!cnpj) return ''
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  }

  return (
    <footer className="footer-custom">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-4">{storeData.name}</h3>
            <p className="text-gray-400 mb-4">{storeData.description}</p>
            {storeData.cnpj && (
              <p className="text-sm text-gray-400">CNPJ: {formatCNPJ(storeData.cnpj)}</p>
            )}
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Institucional</h4>
            <ul className="space-y-2">
              <li><Link href="/sobre" className="text-gray-400 hover:opacity-80">Sobre Nós</Link></li>
              <li><Link href="/politica-privacidade" className="text-gray-400 hover:opacity-80">Política de Privacidade</Link></li>
              <li><Link href="/termos-uso" className="text-gray-400 hover:opacity-80">Termos de Uso</Link></li>
              <li><Link href="/politica-troca" className="text-gray-400 hover:opacity-80">Política de Troca</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Redes Sociais</h4>
            <div className="flex space-x-4">
              {storeData.instagram && <a href={storeData.instagram.startsWith('http') ? storeData.instagram : `https://instagram.com/${storeData.instagram}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:opacity-80"><Instagram className="h-6 w-6" /></a>}
              {storeData.facebook && <a href={storeData.facebook.startsWith('http') ? storeData.facebook : `https://facebook.com/${storeData.facebook}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:opacity-80"><Facebook className="h-6 w-6" /></a>}
              {storeData.tiktok && <a href={storeData.tiktok.startsWith('http') ? storeData.tiktok : `https://tiktok.com/@${storeData.tiktok}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:opacity-80"><TikTokIcon className="h-6 w-6" /></a>}
              {storeData.youtube && <a href={storeData.youtube.startsWith('http') ? storeData.youtube : `https://youtube.com/@${storeData.youtube}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:opacity-80"><Youtube className="h-6 w-6" /></a>}
            </div>
            
            {storeData.whatsapp && (
                <div className="flex items-center gap-2 mt-4">
                  <MessageCircle className="h-4 w-4" />
                  <a href={`https://wa.me/55${storeData.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-green-400 text-sm">
                    Fale no WhatsApp
                  </a>
                </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} {storeData.name}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
} 