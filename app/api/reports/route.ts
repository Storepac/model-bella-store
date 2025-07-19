import { NextRequest, NextResponse } from 'next/server'
import { apiRequest } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('storeId') || '1'
    const dateRange = searchParams.get('dateRange') || '30d'
    
    // Buscar dados reais de vendas, produtos e categorias
    const [ordersRes, productsRes, categoriesRes] = await Promise.allSettled([
      apiRequest(`/orders?storeId=${storeId}&range=${dateRange}`).catch(() => ({ orders: [] })),
      apiRequest(`/products?storeId=${storeId}`).catch(() => ({ products: [] })),
      apiRequest(`/categories?storeId=${storeId}`).catch(() => [])
    ])

    const orders = ordersRes.status === 'fulfilled' ? (ordersRes.value as any)?.orders || [] : []
    const products = productsRes.status === 'fulfilled' ? (productsRes.value as any)?.products || [] : []
    const categories = categoriesRes.status === 'fulfilled' ? (categoriesRes.value as any) || [] : []

    // Calcular métricas reais
    const totalSales = orders.reduce((sum: number, order: any) => sum + (parseFloat(order.total) || 0), 0)
    const totalOrders = orders.length
    const uniqueClients = new Set(orders.map((order: any) => order.clientId)).size

    // Dados por mês (últimos 6 meses)
    const monthlyData = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const month = date.toLocaleDateString('pt-BR', { month: 'short' })
      
      const monthOrders = orders.filter((order: any) => {
        const orderDate = new Date(order.createdAt)
        return orderDate.getMonth() === date.getMonth() && orderDate.getFullYear() === date.getFullYear()
      })
      
      monthlyData.push({
        month: month.charAt(0).toUpperCase() + month.slice(1),
        vendas: monthOrders.reduce((sum: number, order: any) => sum + (parseFloat(order.total) || 0), 0),
        pedidos: monthOrders.length,
        clientes: new Set(monthOrders.map((order: any) => order.clientId)).size
      })
    }

    // Top produtos
    const productSales = products.map((product: any) => {
      const productOrders = orders.filter((order: any) => 
        order.items?.some((item: any) => item.productId === product.id)
      )
      
      const sales = productOrders.reduce((sum: number, order: any) => {
        const item = order.items.find((item: any) => item.productId === product.id)
        return sum + (item?.quantity || 0)
      }, 0)
      
      const revenue = productOrders.reduce((sum: number, order: any) => {
        const item = order.items.find((item: any) => item.productId === product.id)
        return sum + ((item?.quantity || 0) * (parseFloat(item?.price) || 0))
      }, 0)

      return {
        name: product.name,
        vendas: sales,
        valor: revenue,
        views: Math.floor(sales * 15), // Estimativa baseada nas vendas
        category: product.category
              }
      }).sort((a: any, b: any) => b.vendas - a.vendas).slice(0, 10)

    // Dados por categoria
    const categoryData = categories.map((category: any) => {
      const categoryProducts = products.filter((p: any) => p.categoryId === category.id)
      const categoryOrders = orders.filter((order: any) =>
        order.items?.some((item: any) => 
          categoryProducts.some((p: any) => p.id === item.productId)
        )
      )
      
      const sales = categoryOrders.reduce((sum: number, order: any) => {
        return sum + order.items.filter((item: any) => 
          categoryProducts.some((p: any) => p.id === item.productId)
        ).reduce((itemSum: number, item: any) => itemSum + (item.quantity || 0), 0)
      }, 0)

      const revenue = categoryOrders.reduce((sum: number, order: any) => {
        return sum + order.items.filter((item: any) => 
          categoryProducts.some((p: any) => p.id === item.productId)
        ).reduce((itemSum: number, item: any) => itemSum + ((item.quantity || 0) * (parseFloat(item.price) || 0)), 0)
      }, 0)

      return {
        name: category.name,
        vendas: sales,
        valor: revenue,
        views: Math.floor(sales * 12)
      }
         }).sort((a: any, b: any) => b.vendas - a.vendas)

    // Se não há dados reais, usar mock básico
    if (orders.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          salesData: [
            { month: "Jan", vendas: 0, pedidos: 0, clientes: 0 },
            { month: "Fev", vendas: 0, pedidos: 0, clientes: 0 },
            { month: "Mar", vendas: 0, pedidos: 0, clientes: 0 },
            { month: "Abr", vendas: 0, pedidos: 0, clientes: 0 },
            { month: "Mai", vendas: 0, pedidos: 0, clientes: 0 },
            { month: "Jun", vendas: 0, pedidos: 0, clientes: 0 },
          ],
          productData: [],
          categoryData: [],
          topProducts: [],
          metrics: {
            totalSales: 0,
            totalOrders: 0,
            totalClients: 0,
            conversionRate: 0
          }
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        salesData: monthlyData,
        productData: productSales.slice(0, 5),
        categoryData: categoryData.slice(0, 5),
        topProducts: productSales.slice(0, 5),
        metrics: {
          totalSales,
          totalOrders,
          totalClients: uniqueClients,
          conversionRate: uniqueClients > 0 ? (totalOrders / uniqueClients * 100) : 0
        }
      }
    })

  } catch (error) {
    console.error('Erro ao buscar relatórios:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
} 