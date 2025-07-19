"use client"

import { useStoreData } from "@/hooks/use-store-data"
import { usePathname } from "next/navigation"
import Image from "next/image"

interface StoreLogoProps {
  className?: string
  showName?: boolean
  size?: "sm" | "md" | "lg"
}

export function StoreLogo({ className = "", showName = true, size = "md" }: StoreLogoProps) {
  const { storeData, loading } = useStoreData()
  const pathname = usePathname()
  
  // Detectar se está na demo
  const isDemo = pathname?.startsWith('/demo')
  const isDemo2 = pathname?.startsWith('/demo2')

  // Dados das demos
  const demoData = {
    name: "Bella Store",
    logo: "B",
    logoUrl: null,
    theme: "pink"
  }

  const demo2Data = {
    name: "TechStore",
    logo: "T", 
    logoUrl: null,
    theme: "blue"
  }

  // Definir dados baseado no contexto
  const getStoreInfo = () => {
    if (isDemo2) return demo2Data
    if (isDemo) return demoData
    if (storeData && storeData.name) {
      return {
        name: storeData.name,
        logo: storeData.name.charAt(0).toUpperCase(),
        logoUrl: null,
        theme: "default"
      }
    }
    return demoData
  }

  const storeInfo = getStoreInfo()

  // Tamanhos
  const sizeClasses = {
    sm: "w-8 h-8 text-lg",
    md: "w-12 h-12 text-2xl", 
    lg: "w-16 h-16 text-3xl"
  }

  const nameSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl"
  }

  // Cores por tema
  const getThemeColors = (theme: string) => {
    switch (theme) {
      case "pink":
        return "from-pink-500 to-purple-600"
      case "blue":
        return "from-blue-500 to-indigo-600"
      default:
        return "from-gray-700 to-gray-900"
    }
  }

  if (loading) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className={`${sizeClasses[size]} bg-gray-200 rounded-lg animate-pulse`}></div>
        {showName && (
          <div className={`${nameSizes[size]} font-bold bg-gray-200 h-8 w-32 rounded animate-pulse`}></div>
        )}
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo - SVG/PNG ou fallback para inicial */}
      {storeInfo.logoUrl ? (
        // Logo personalizada (SVG/PNG)
        <div className={`${sizeClasses[size]} relative rounded-lg overflow-hidden shadow-lg`}>
          <Image
            src={storeInfo.logoUrl}
            alt={storeInfo.name}
            fill
            className="object-contain"
          />
        </div>
      ) : (
        // Fallback para inicial com gradiente
        <div className={`${sizeClasses[size]} bg-gradient-to-br ${getThemeColors(storeInfo.theme)} rounded-lg flex items-center justify-center text-white font-bold shadow-lg`}>
          {storeInfo.logo}
        </div>
      )}
      
      {/* Nome da loja */}
      {showName && (
        <h1 className={`${nameSizes[size]} font-bold bg-gradient-to-r ${getThemeColors(storeInfo.theme)} bg-clip-text text-transparent`}>
          {storeInfo.name}
        </h1>
      )}
    </div>
  )
} 