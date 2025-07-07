import { resolveStoreId } from '@/lib/store-id'
import { useEffect, useState } from 'react'

export function MegaMenu() {
  const [categories, setCategories] = useState<any[]>([])
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const resolvedStoreId = await resolveStoreId()
        const res = await fetch(`/api/categories?storeId=${resolvedStoreId}`)
        const data = await res.json()
        setCategories(data)
      } catch (err) {
        setCategories([])
      }
    }
    fetchCategories()
  }, [])
} 