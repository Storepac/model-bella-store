import { resolveStoreId } from '@/lib/store-id'
import { useEffect, useState } from 'react'

export function HeroBanner() {
  const [banners, setBanners] = useState<any[]>([])
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const resolvedStoreId = await resolveStoreId()
        const res = await fetch(`/api/banners?storeId=${resolvedStoreId}`)
        const data = await res.json()
        if (data.banners) setBanners(data.banners)
      } catch (err) {
        setBanners([])
      }
    }
    fetchBanners()
  }, [])
} 