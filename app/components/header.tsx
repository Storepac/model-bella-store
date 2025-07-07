import { resolveStoreId } from '@/lib/store-id'
import { useEffect, useState } from 'react'

export function Header() {
  const [storeData, setStoreData] = useState<any>(null)
  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const resolvedStoreId = await resolveStoreId()
        const host = window.location.host
        const res = await fetch(`/api/store-data?host=${encodeURIComponent(host)}`)
        const data = await res.json()
        if (data.success) setStoreData(data.data)
      } catch (err) {
        setStoreData(null)
      }
    }
    fetchStoreData()
  }, [])
} 