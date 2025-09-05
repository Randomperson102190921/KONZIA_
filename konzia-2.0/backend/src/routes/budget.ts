import express from 'express'
import { PrismaClient } from '@prisma/client'
import { asyncHandler, createError } from '../middleware/errorHandler'
import { authenticate } from '../middleware/auth'
import { validateBudgetItem } from '../middleware/validation'

const router = express.Router()
const prisma = new PrismaClient()

// All routes require authentication
router.use(authenticate)

// @desc    Get all budget items for user
// @route   GET /api/budget
// @access  Private
router.get('/', asyncHandler(async (req: any, res) => {
  const budgetItems = await prisma.budgetItem.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
  })

  const totalSpent = budgetItems.reduce((sum, item) => sum + item.spent, 0)
  const totalLimit = budgetItems.reduce((sum, item) => sum + item.limit, 0)

  res.json({
    success: true,
    data: {
      items: budgetItems,
      totalSpent,
      totalLimit,
      remaining: totalLimit - totalSpent,
    },
  })
}))

// @desc    Create new budget item
// @route   POST /api/budget
// @access  Private
router.post('/', validateBudgetItem, asyncHandler(async (req: any, res) => {
  const budgetItem = await prisma.budgetItem.create({
    data: {
      ...req.body,
      userId: req.user.id,
    },
  })

  res.status(201).json({
    success: true,
    data: budgetItem,
    message: 'Budget item created successfully',
  })
}))

// @desc    Get single budget item
// @route   GET /api/budget/:id
// @access  Private
router.get('/:id', asyncHandler(async (req: any, res) => {
  const budgetItem = await prisma.budgetItem.findFirst({
    where: {
      id: req.params.id,
      userId: req.user.id,
    },
  })

  if (!budgetItem) {
    throw createError('Budget item not found', 404)
  }

  res.json({
    success: true,
    data: budgetItem,
  })
}))

// @desc    Update budget item
// @route   PUT /api/budget/:id
// @access  Private
router.put('/:id', validateBudgetItem, asyncHandler(async (req: any, res) => {
  const budgetItem = await prisma.budgetItem.findFirst({
    where: {
      id: req.params.id,
      userId: req.user.id,
    },
  })

  if (!budgetItem) {
    throw createError('Budget item not found', 404)
  }

  const updatedItem = await prisma.budgetItem.update({
    where: { id: req.params.id },
    data: req.body,
  })

  res.json({
    success: true,
    data: updatedItem,
    message: 'Budget item updated successfully',
  })
}))

// @desc    Delete budget item
// @route   DELETE /api/budget/:id
// @access  Private
router.delete('/:id', asyncHandler(async (req: any, res) => {
  const budgetItem = await prisma.budgetItem.findFirst({
    where: {
      id: req.params.id,
      userId: req.user.id,
    },
  })

  if (!budgetItem) {
    throw createError('Budget item not found', 404)
  }

  await prisma.budgetItem.delete({
    where: { id: req.params.id },
  })

  res.json({
    success: true,
    message: 'Budget item deleted successfully',
  })
}))

// @desc    Update spent amount for budget item
// @route   PATCH /api/budget/:id/spent
// @access  Private
router.patch('/:id/spent', asyncHandler(async (req: any, res) => {
  const { spent } = req.body

  if (spent < 0) {
    throw createError('Spent amount cannot be negative', 400)
  }

  const budgetItem = await prisma.budgetItem.findFirst({
    where: {
      id: req.params.id,
      userId: req.user.id,
    },
  })

  if (!budgetItem) {
    throw createError('Budget item not found', 404)
  }

  const updatedItem = await prisma.budgetItem.update({
    where: { id: req.params.id },
    data: { spent },
  })

  res.json({
    success: true,
    data: updatedItem,
    message: 'Spent amount updated successfully',
  })
}))

// @desc    Reset all budget items spent amounts
// @route   PATCH /api/budget/reset
// @access  Private
router.patch('/reset', asyncHandler(async (req: any, res) => {
  await prisma.budgetItem.updateMany({
    where: { userId: req.user.id },
    data: { spent: 0 },
  })

  res.json({
    success: true,
    message: 'All budget items reset successfully',
  })
}))

// @desc    Get budget summary
// @route   GET /api/budget/summary
// @access  Private
router.get('/summary', asyncHandler(async (req: any, res) => {
  const budgetItems = await prisma.budgetItem.findMany({
    where: { userId: req.user.id },
  })

  const totalSpent = budgetItems.reduce((sum, item) => sum + item.spent, 0)
  const totalLimit = budgetItems.reduce((sum, item) => sum + item.limit, 0)
  const remaining = totalLimit - totalSpent
  const percentage = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0

  const categoryBreakdown = budgetItems.map(item => ({
    ...item,
    percentage: totalLimit > 0 ? (item.spent / totalLimit) * 100 : 0,
    remaining: item.limit - item.spent,
    isOverLimit: item.spent > item.limit,
  }))

  res.json({
    success: true,
    data: {
      totalSpent,
      totalLimit,
      remaining,
      percentage: Math.round(percentage * 100) / 100,
      isOverBudget: totalSpent > totalLimit,
      categoryBreakdown,
    },
  })
}))

export default router
