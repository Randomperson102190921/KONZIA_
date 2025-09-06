import express from 'express'
import { prisma } from '../utils/prisma'
import { asyncHandler, createError } from '../middleware/errorHandler'
import { authenticate } from '../middleware/auth'

const router = express.Router()

// All routes require authentication
router.use(authenticate)

// @desc    Get spending analytics
// @route   GET /api/analytics/spending
// @access  Private
router.get('/spending', asyncHandler(async (req: any, res) => {
  const { period = '30d' } = req.query

  // Calculate date range based on period
  const now = new Date()
  let startDate: Date

  switch (period) {
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    case '90d':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      break
    case '1y':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
      break
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  }

  // Get completed shopping items with prices
  const completedItems = await prisma.shoppingItem.findMany({
    where: {
      list: {
        userId: req.user.id,
      },
      isCompleted: true,
      price: {
        not: null,
      },
      completedAt: {
        gte: startDate,
      },
    },
    select: {
      price: true,
      category: true,
      name: true,
      completedAt: true,
    },
  })

  // Get spending records
  const spendingRecords = await prisma.spendingRecord.findMany({
    where: {
      userId: req.user.id,
      createdAt: {
        gte: startDate,
      },
    },
  })

  // Combine and process data
  const allSpending = [
    ...completedItems.map(item => ({
      amount: item.price!,
      category: item.category,
      itemName: item.name,
      date: item.completedAt!,
    })),
    ...spendingRecords,
  ]

  // Calculate totals
  const totalSpent = allSpending.reduce((sum, item) => sum + item.amount, 0)
  const averageDaily = totalSpent / Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

  // Category breakdown
  const categoryTotals = allSpending.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount
    return acc
  }, {} as Record<string, number>)

  const categoryBreakdown = Object.entries(categoryTotals).map(([category, amount]) => ({
    category,
    amount,
    percentage: totalSpent > 0 ? (amount / totalSpent) * 100 : 0,
  }))

  // Daily spending data
  const dailySpending = allSpending.reduce((acc, item) => {
    const date = item.date.toISOString().split('T')[0]
    acc[date] = (acc[date] || 0) + item.amount
    return acc
  }, {} as Record<string, number>)

  const dailyData = Object.entries(dailySpending).map(([date, amount]) => ({
    date,
    amount,
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  res.json({
    success: true,
    data: {
      totalSpent,
      averageDaily,
      categoryBreakdown,
      dailyData,
      period,
      startDate,
      endDate: now,
    },
  })
}))

// @desc    Get category analytics
// @route   GET /api/analytics/categories
// @access  Private
router.get('/categories', asyncHandler(async (req: any, res) => {
  const { period = '30d' } = req.query

  // Calculate date range
  const now = new Date()
  let startDate: Date

  switch (period) {
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    case '90d':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      break
    case '1y':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
      break
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  }

  // Get completed items by category
  const categoryData = await prisma.shoppingItem.groupBy({
    by: ['category'],
    where: {
      list: {
        userId: req.user.id,
      },
      isCompleted: true,
      price: {
        not: null,
      },
      completedAt: {
        gte: startDate,
      },
    },
    _sum: {
      price: true,
    },
    _count: {
      id: true,
    },
  })

  const totalSpent = categoryData.reduce((sum, item) => sum + (item._sum.price || 0), 0)

  const categories = categoryData.map(item => ({
    category: item.category,
    totalSpent: item._sum.price || 0,
    itemCount: item._count.id,
    percentage: totalSpent > 0 ? ((item._sum.price || 0) / totalSpent) * 100 : 0,
  })).sort((a, b) => b.totalSpent - a.totalSpent)

  res.json({
    success: true,
    data: {
      categories,
      totalSpent,
      period,
    },
  })
}))

// @desc    Get monthly trends
// @route   GET /api/analytics/trends
// @access  Private
router.get('/trends', asyncHandler(async (req: any, res) => {
  const { months = 12 } = req.query

  const now = new Date()
  const startDate = new Date(now.getFullYear(), now.getMonth() - parseInt(months as string), 1)

  // Get monthly spending data
  const monthlyData = await prisma.shoppingItem.groupBy({
    by: ['completedAt'],
    where: {
      list: {
        userId: req.user.id,
      },
      isCompleted: true,
      price: {
        not: null,
      },
      completedAt: {
        gte: startDate,
      },
    },
    _sum: {
      price: true,
    },
  })

  // Get budget data for comparison
  const budgetItems = await prisma.budgetItem.findMany({
    where: { userId: req.user.id },
  })

  const monthlyBudget = budgetItems.reduce((sum, item) => sum + item.limit, 0)

  // Process monthly data
  const monthlyTrends = []
  for (let i = 0; i < parseInt(months as string); i++) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthName = month.toLocaleDateString('en-US', { month: 'short' })
    
    const monthSpending = monthlyData
      .filter(item => {
        const itemDate = new Date(item.completedAt!)
        return itemDate.getMonth() === month.getMonth() && 
               itemDate.getFullYear() === month.getFullYear()
      })
      .reduce((sum, item) => sum + (item._sum.price || 0), 0)

    monthlyTrends.unshift({
      month: monthName,
      spent: monthSpending,
      budget: monthlyBudget,
      percentage: monthlyBudget > 0 ? (monthSpending / monthlyBudget) * 100 : 0,
    })
  }

  res.json({
    success: true,
    data: {
      trends: monthlyTrends,
      totalMonths: parseInt(months as string),
    },
  })
}))

// @desc    Get top items
// @route   GET /api/analytics/top-items
// @access  Private
router.get('/top-items', asyncHandler(async (req: any, res) => {
  const { limit = 10 } = req.query

  // Get top purchased items by price
  const topItems = await prisma.shoppingItem.findMany({
    where: {
      list: {
        userId: req.user.id,
      },
      isCompleted: true,
      price: {
        not: null,
      },
    },
    select: {
      name: true,
      price: true,
      category: true,
      completedAt: true,
    },
    orderBy: {
      price: 'desc',
    },
    take: parseInt(limit as string),
  })

  // Get most frequent items
  const frequentItems = await prisma.shoppingItem.groupBy({
    by: ['name'],
    where: {
      list: {
        userId: req.user.id,
      },
      isCompleted: true,
    },
    _count: {
      id: true,
    },
    _sum: {
      price: true,
    },
    orderBy: {
      _count: {
        id: 'desc',
      },
    },
    take: parseInt(limit as string),
  })

  res.json({
    success: true,
    data: {
      topByPrice: topItems,
      topByFrequency: frequentItems.map(item => ({
        name: item.name,
        frequency: item._count.id,
        totalSpent: item._sum.price || 0,
      })),
    },
  })
}))

export default router
