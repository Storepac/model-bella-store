import { resolveStoreId } from '@/lib/store-id'
import { useEffect, useState } from 'react'

// Exemplo de uso, caso haja fetch dinâmico de produtos:
// useEffect(() => {
//   const fetchProducts = async () => {
//     try {
//       const resolvedStoreId = await resolveStoreId()
//       const res = await fetch(`/api/products?storeId=${resolvedStoreId}`)
//       const data = await res.json()
//       setProducts(data.products || [])
//     } catch (err) {
//       setProducts([])
//     }
//   }
//   fetchProducts()
// }, []) 