"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { mockBanners } from "@/lib/banner-data"
import Link from "next/link"

export function HeroBanner() {
  const headerBanner = mockBanners.find((b) => b.position === "homepage-header" && b.isActive)

  if (!headerBanner) {
    return null // Ou um banner padrão
  }

  return (
    <section className="bg-gradient-to-r from-pink-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center w-full py-8 md:py-0 md:h-[60vh]">
          {/* Content */}
          <div className="space-y-4 md:space-y-6 text-center md:text-left">
            <h2 className="text-3xl md:text-6xl font-bold text-gray-900">{headerBanner.title}</h2>
            <p className="text-md md:text-lg text-muted-foreground max-w-md mx-auto md:mx-0">
              {headerBanner.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button size="lg" className="bg-pink-500 hover:bg-pink-600 text-white px-8" asChild>
                <Link href={headerBanner.link}>{headerBanner.buttonText}</Link>
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative h-64 md:h-full md:min-h-[400px]">
            <Image
              src={headerBanner.image || "/placeholder.svg"}
              alt={headerBanner.title}
              fill
              className="object-cover rounded-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
