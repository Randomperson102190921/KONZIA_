import express from 'express'
import { PrismaClient } from '@prisma/client'
import { asyncHandler, createError } from '../middleware/errorHandler'
import { authenticate } from '../middleware/auth'
import { validateShoppingItem } from '../middleware/validation'

const router = express.Router()
const prisma = new PrismaClient()

// All routes require authentication
router.use(authenticate)

// @desc    Get all shopping lists for user
// @route   GET /api/shopping-list
// @access  Private
router.get('/', asyncHandler(async (req: any, res) => {
  const lists = await prisma.shoppingList.findMany({
    where: { userId: req.user.id },
    include: {
      items: {
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  res.json({
    success: true,
    data: lists,
  })
}))

// @desc    Create new shopping list
// @route   POST /api/shopping-list
// @access  Private
router.post('/', asyncHandler(async (req: any, res) => {
  const { name } = req.body

  const list = await prisma.shoppingList.create({
    data: {
      name,
      userId: req.user.id,
    },
    include: {
      items: true,
    },
  })

  res.status(201).json({
    success: true,
    data: list,
    message: 'Shopping list created successfully',
  })
}))

// @desc    Get single shopping list
// @route   GET /api/shopping-list/:id
// @access  Private
router.get('/:id', asyncHandler(async (req: any, res) => {
  const list = await prisma.shoppingList.findFirst({
    where: {
      id: req.params.id,
      userId: req.user.id,
    },
    include: {
      items: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!list) {
    throw createError('Shopping list not found', 404)
  }

  res.json({
    success: true,
    data: list,
  })
}))

// @desc    Update shopping list
// @route   PUT /api/shopping-list/:id
// @access  Private
router.put('/:id', asyncHandler(async (req: any, res) => {
  const { name } = req.body

  const list = await prisma.shoppingList.findFirst({
    where: {
      id: req.params.id,
      userId: req.user.id,
    },
  })

  if (!list) {
    throw createError('Shopping list not found', 404)
  }

  const updatedList = await prisma.shoppingList.update({
    where: { id: req.params.id },
    data: { name },
    include: {
      items: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  res.json({
    success: true,
    data: updatedList,
    message: 'Shopping list updated successfully',
  })
}))

// @desc    Delete shopping list
// @route   DELETE /api/shopping-list/:id
// @access  Private
router.delete('/:id', asyncHandler(async (req: any, res) => {
  const list = await prisma.shoppingList.findFirst({
    where: {
      id: req.params.id,
      userId: req.user.id,
    },
  })

  if (!list) {
    throw createError('Shopping list not found', 404)
  }

  await prisma.shoppingList.delete({
    where: { id: req.params.id },
  })

  res.json({
    success: true,
    message: 'Shopping list deleted successfully',
  })
}))

// @desc    Add item to shopping list
// @route   POST /api/shopping-list/:id/items
// @access  Private
router.post('/:id/items', validateShoppingItem, asyncHandler(async (req: any, res) => {
  const list = await prisma.shoppingList.findFirst({
    where: {
      id: req.params.id,
      userId: req.user.id,
    },
  })

  if (!list) {
    throw createError('Shopping list not found', 404)
  }

  const item = await prisma.shoppingItem.create({
    data: {
      ...req.body,
      listId: req.params.id,
    },
  })

  res.status(201).json({
    success: true,
    data: item,
    message: 'Item added successfully',
  })
}))

// @desc    Update shopping item
// @route   PUT /api/shopping-list/items/:itemId
// @access  Private
router.put('/items/:itemId', validateShoppingItem, asyncHandler(async (req: any, res) => {
  const item = await prisma.shoppingItem.findFirst({
    where: {
      id: req.params.itemId,
      list: {
        userId: req.user.id,
      },
    },
  })

  if (!item) {
    throw createError('Shopping item not found', 404)
  }

  const updatedItem = await prisma.shoppingItem.update({
    where: { id: req.params.itemId },
    data: {
      ...req.body,
      completedAt: req.body.isCompleted && !item.isCompleted ? new Date() : null,
    },
  })

  res.json({
    success: true,
    data: updatedItem,
    message: 'Item updated successfully',
  })
}))

// @desc    Delete shopping item
// @route   DELETE /api/shopping-list/items/:itemId
// @access  Private
router.delete('/items/:itemId', asyncHandler(async (req: any, res) => {
  const item = await prisma.shoppingItem.findFirst({
    where: {
      id: req.params.itemId,
      list: {
        userId: req.user.id,
      },
    },
  })

  if (!item) {
    throw createError('Shopping item not found', 404)
  }

  await prisma.shoppingItem.delete({
    where: { id: req.params.itemId },
  })

  res.json({
    success: true,
    message: 'Item deleted successfully',
  })
}))

// @desc    Toggle item completion
// @route   PATCH /api/shopping-list/items/:itemId/toggle
// @access  Private
router.patch('/items/:itemId/toggle', asyncHandler(async (req: any, res) => {
  const item = await prisma.shoppingItem.findFirst({
    where: {
      id: req.params.itemId,
      list: {
        userId: req.user.id,
      },
    },
  })

  if (!item) {
    throw createError('Shopping item not found', 404)
  }

  const updatedItem = await prisma.shoppingItem.update({
    where: { id: req.params.itemId },
    data: {
      isCompleted: !item.isCompleted,
      completedAt: !item.isCompleted ? new Date() : null,
    },
  })

  res.json({
    success: true,
    data: updatedItem,
    message: 'Item toggled successfully',
  })
}))

// @desc    Clear completed items
// @route   DELETE /api/shopping-list/:id/items/completed
// @access  Private
router.delete('/:id/items/completed', asyncHandler(async (req: any, res) => {
  const list = await prisma.shoppingList.findFirst({
    where: {
      id: req.params.id,
      userId: req.user.id,
    },
  })

  if (!list) {
    throw createError('Shopping list not found', 404)
  }

  await prisma.shoppingItem.deleteMany({
    where: {
      listId: req.params.id,
      isCompleted: true,
    },
  })

  res.json({
    success: true,
    message: 'Completed items cleared successfully',
  })
}))

export default router
