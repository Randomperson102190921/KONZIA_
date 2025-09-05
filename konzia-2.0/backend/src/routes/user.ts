import express from 'express'
import { PrismaClient } from '@prisma/client'
import { asyncHandler, createError } from '../middleware/errorHandler'
import { authenticate } from '../middleware/auth'

const router = express.Router()
const prisma = new PrismaClient()

// All routes require authentication
router.use(authenticate)

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
router.get('/profile', asyncHandler(async (req: any, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!user) {
    throw createError('User not found', 404)
  }

  res.json({
    success: true,
    data: { user },
  })
}))

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
router.put('/profile', asyncHandler(async (req: any, res) => {
  const { name, email, avatar } = req.body

  // Check if email is already taken by another user
  if (email) {
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        id: { not: req.user.id },
      },
    })

    if (existingUser) {
      throw createError('Email is already taken', 400)
    }
  }

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      name,
      email,
      avatar,
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  res.json({
    success: true,
    data: { user },
    message: 'Profile updated successfully',
  })
}))

// @desc    Get user statistics
// @route   GET /api/user/stats
// @access  Private
router.get('/stats', asyncHandler(async (req: any, res) => {
  const userId = req.user.id

  // Get shopping list statistics
  const shoppingLists = await prisma.shoppingList.count({
    where: { userId },
  })

  const totalItems = await prisma.shoppingItem.count({
    where: {
      list: { userId },
    },
  })

  const completedItems = await prisma.shoppingItem.count({
    where: {
      list: { userId },
      isCompleted: true,
    },
  })

  // Get budget statistics
  const budgetItems = await prisma.budgetItem.findMany({
    where: { userId },
  })

  const totalBudget = budgetItems.reduce((sum, item) => sum + item.limit, 0)
  const totalSpent = budgetItems.reduce((sum, item) => sum + item.spent, 0)

  // Get recipe statistics
  const userRecipes = await prisma.recipe.count({
    where: { userId },
  })

  // Get spending records
  const spendingRecords = await prisma.spendingRecord.findMany({
    where: { userId },
  })

  const totalSpending = spendingRecords.reduce((sum, record) => sum + record.amount, 0)

  res.json({
    success: true,
    data: {
      shopping: {
        lists: shoppingLists,
        totalItems,
        completedItems,
        completionRate: totalItems > 0 ? (completedItems / totalItems) * 100 : 0,
      },
      budget: {
        totalBudget,
        totalSpent,
        remaining: totalBudget - totalSpent,
        budgetUsage: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
      },
      recipes: {
        userRecipes,
      },
      spending: {
        totalSpending,
        recordCount: spendingRecords.length,
      },
    },
  })
}))

// @desc    Get user notifications
// @route   GET /api/user/notifications
// @access  Private
router.get('/notifications', asyncHandler(async (req: any, res) => {
  const { limit = 20, offset = 0, unreadOnly = false } = req.query

  const where: any = { userId: req.user.id }
  if (unreadOnly === 'true') {
    where.isRead = false
  }

  const notifications = await prisma.notification.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: parseInt(limit as string),
    skip: parseInt(offset as string),
  })

  const total = await prisma.notification.count({ where })

  res.json({
    success: true,
    data: {
      notifications,
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        hasMore: parseInt(offset as string) + parseInt(limit as string) < total,
      },
    },
  })
}))

// @desc    Mark notification as read
// @route   PATCH /api/user/notifications/:id/read
// @access  Private
router.patch('/notifications/:id/read', asyncHandler(async (req: any, res) => {
  const notification = await prisma.notification.findFirst({
    where: {
      id: req.params.id,
      userId: req.user.id,
    },
  })

  if (!notification) {
    throw createError('Notification not found', 404)
  }

  await prisma.notification.update({
    where: { id: req.params.id },
    data: { isRead: true },
  })

  res.json({
    success: true,
    message: 'Notification marked as read',
  })
}))

// @desc    Mark all notifications as read
// @route   PATCH /api/user/notifications/read-all
// @access  Private
router.patch('/notifications/read-all', asyncHandler(async (req: any, res) => {
  await prisma.notification.updateMany({
    where: {
      userId: req.user.id,
      isRead: false,
    },
    data: { isRead: true },
  })

  res.json({
    success: true,
    message: 'All notifications marked as read',
  })
}))

// @desc    Delete notification
// @route   DELETE /api/user/notifications/:id
// @access  Private
router.delete('/notifications/:id', asyncHandler(async (req: any, res) => {
  const notification = await prisma.notification.findFirst({
    where: {
      id: req.params.id,
      userId: req.user.id,
    },
  })

  if (!notification) {
    throw createError('Notification not found', 404)
  }

  await prisma.notification.delete({
    where: { id: req.params.id },
  })

  res.json({
    success: true,
    message: 'Notification deleted',
  })
}))

// @desc    Get user preferences
// @route   GET /api/user/preferences
// @access  Private
router.get('/preferences', asyncHandler(async (req: any, res) => {
  // In a real app, this would come from a user preferences table
  // For now, return default preferences
  const preferences = {
    theme: 'system',
    language: 'en',
    currency: 'USD',
    notifications: {
      budgetAlerts: true,
      priceDrops: true,
      expiryReminders: true,
      weeklyReports: false,
    },
    privacy: {
      shareData: false,
      analytics: true,
    },
  }

  res.json({
    success: true,
    data: preferences,
  })
}))

// @desc    Update user preferences
// @route   PUT /api/user/preferences
// @access  Private
router.put('/preferences', asyncHandler(async (req: any, res) => {
  // In a real app, this would update a user preferences table
  // For now, just return the updated preferences
  const preferences = req.body

  res.json({
    success: true,
    data: preferences,
    message: 'Preferences updated successfully',
  })
}))

export default router
