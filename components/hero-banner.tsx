"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { mockBanners } from "@/lib/banner-data"
import Link from "next/link"

interface HeroBannerProps {
  title?: string
  subtitle?: string
  image?: string
  ctaText?: string
  ctaLink?: string
  theme?: "pink" | "blue"
}

export function HeroBanner({ 
  title, 
  subtitle, 
  image, 
  ctaText, 
  ctaLink, 
  theme = "pink" 
}: HeroBannerProps) {
  // Se não foram passadas props, usar dados do mock
  const headerBanner = !title ? mockBanners.find((b) => b.position === "homepage-header" && b.isActive) : null

  const bannerTitle = title || headerBanner?.title || "Bella Store"
  const bannerSubtitle = subtitle || headerBanner?.description || "Descubra as melhores ofertas"
  const bannerImage = image || headerBanner?.image || "/placeholder.svg"
  const bannerCtaText = ctaText || headerBanner?.buttonText || "Ver Produtos"
  const bannerCtaLink = ctaLink || headerBanner?.link || "/categoria"

  const themeClasses = {
    pink: {
      bg: "bg-gradient-to-r from-pink-50 to-purple-50",
      button: "bg-pink-500 hover:bg-pink-600 text-white"
    },
    blue: {
      bg: "bg-gradient-to-r from-blue-50 to-indigo-50",
      button: "bg-blue-600 hover:bg-blue-700 text-white"
    }
  }

  const currentTheme = themeClasses[theme]

  return (
    <section className={currentTheme.bg}>
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center w-full py-6 md:py-8 lg:py-0 lg:h-[60vh]">
          {/* Content */}
          <div className="space-y-3 md:space-y-4 lg:space-y-6 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900">
              {bannerTitle}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-md mx-auto md:mx-0">
              {bannerSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center md:justify-start">
              <Button 
                size="lg" 
                className={`${currentTheme.button} px-6 md:px-8 py-2 md:py-3 text-sm md:text-base`} 
                asChild
              >
                <Link href={bannerCtaLink}>{bannerCtaText}</Link>
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative h-48 sm:h-56 md:h-64 lg:h-full lg:min-h-[400px]">
            <Image
              src={bannerImage}
              alt={bannerTitle}
              fill
              className="object-cover rounded-lg md:rounded-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
