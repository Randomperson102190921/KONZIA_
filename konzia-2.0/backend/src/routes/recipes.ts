import express from 'express'
import { PrismaClient } from '@prisma/client'
import { asyncHandler, createError } from '../middleware/errorHandler'
import { authenticate, optionalAuth } from '../middleware/auth'
import { validateRecipe } from '../middleware/validation'

const router = express.Router()
const prisma = new PrismaClient()

// @desc    Get all recipes
// @route   GET /api/recipes
// @access  Public (with optional auth for user-specific recipes)
router.get('/', optionalAuth, asyncHandler(async (req: any, res) => {
  const { 
    search = '', 
    category = '', 
    difficulty = '', 
    limit = 20, 
    offset = 0 
  } = req.query

  const where: any = {
    OR: [
      { userId: null }, // Public recipes
      ...(req.user ? [{ userId: req.user.id }] : []), // User's own recipes
    ],
  }

  // Add search filter
  if (search) {
    where.AND = [
      {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { tags: { has: search } },
        ],
      },
    ]
  }

  // Add category filter
  if (category) {
    where.tags = { has: category }
  }

  // Add difficulty filter
  if (difficulty) {
    where.difficulty = difficulty.toUpperCase()
  }

  const recipes = await prisma.recipe.findMany({
    where,
    include: {
      ingredients: true,
    },
    orderBy: { createdAt: 'desc' },
    take: parseInt(limit as string),
    skip: parseInt(offset as string),
  })

  const total = await prisma.recipe.count({ where })

  res.json({
    success: true,
    data: {
      recipes,
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        hasMore: parseInt(offset as string) + parseInt(limit as string) < total,
      },
    },
  })
}))

// @desc    Get featured recipes
// @route   GET /api/recipes/featured
// @access  Public
router.get('/featured', asyncHandler(async (req, res) => {
  const recipes = await prisma.recipe.findMany({
    where: {
      userId: null, // Only public recipes
      rating: {
        gte: 4.0, // High-rated recipes
      },
    },
    include: {
      ingredients: true,
    },
    orderBy: { rating: 'desc' },
    take: 6,
  })

  res.json({
    success: true,
    data: recipes,
  })
}))

// @desc    Get single recipe
// @route   GET /api/recipes/:id
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const recipe = await prisma.recipe.findUnique({
    where: { id: req.params.id },
    include: {
      ingredients: true,
    },
  })

  if (!recipe) {
    throw createError('Recipe not found', 404)
  }

  res.json({
    success: true,
    data: recipe,
  })
}))

// @desc    Create new recipe
// @route   POST /api/recipes
// @access  Private
router.post('/', authenticate, validateRecipe, asyncHandler(async (req: any, res) => {
  const { ingredients, ...recipeData } = req.body

  const recipe = await prisma.recipe.create({
    data: {
      ...recipeData,
      userId: req.user.id,
      ingredients: {
        create: ingredients.map((ingredient: any) => ({
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
          notes: ingredient.notes,
        })),
      },
    },
    include: {
      ingredients: true,
    },
  })

  res.status(201).json({
    success: true,
    data: recipe,
    message: 'Recipe created successfully',
  })
}))

// @desc    Update recipe
// @route   PUT /api/recipes/:id
// @access  Private
router.put('/:id', authenticate, validateRecipe, asyncHandler(async (req: any, res) => {
  const recipe = await prisma.recipe.findFirst({
    where: {
      id: req.params.id,
      userId: req.user.id,
    },
  })

  if (!recipe) {
    throw createError('Recipe not found or access denied', 404)
  }

  const { ingredients, ...recipeData } = req.body

  // Update recipe and ingredients
  const updatedRecipe = await prisma.recipe.update({
    where: { id: req.params.id },
    data: {
      ...recipeData,
      ingredients: {
        deleteMany: {},
        create: ingredients.map((ingredient: any) => ({
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
          notes: ingredient.notes,
        })),
      },
    },
    include: {
      ingredients: true,
    },
  })

  res.json({
    success: true,
    data: updatedRecipe,
    message: 'Recipe updated successfully',
  })
}))

// @desc    Delete recipe
// @route   DELETE /api/recipes/:id
// @access  Private
router.delete('/:id', authenticate, asyncHandler(async (req: any, res) => {
  const recipe = await prisma.recipe.findFirst({
    where: {
      id: req.params.id,
      userId: req.user.id,
    },
  })

  if (!recipe) {
    throw createError('Recipe not found or access denied', 404)
  }

  await prisma.recipe.delete({
    where: { id: req.params.id },
  })

  res.json({
    success: true,
    message: 'Recipe deleted successfully',
  })
}))

// @desc    Rate recipe
// @route   POST /api/recipes/:id/rate
// @access  Private
router.post('/:id/rate', authenticate, asyncHandler(async (req: any, res) => {
  const { rating } = req.body

  if (rating < 1 || rating > 5) {
    throw createError('Rating must be between 1 and 5', 400)
  }

  const recipe = await prisma.recipe.findUnique({
    where: { id: req.params.id },
  })

  if (!recipe) {
    throw createError('Recipe not found', 404)
  }

  // Update recipe rating (simple average for demo)
  const newRating = (recipe.rating + rating) / 2

  const updatedRecipe = await prisma.recipe.update({
    where: { id: req.params.id },
    data: { rating: newRating },
  })

  res.json({
    success: true,
    data: updatedRecipe,
    message: 'Recipe rated successfully',
  })
}))

// @desc    Get recipe categories
// @route   GET /api/recipes/categories
// @access  Public
router.get('/categories', asyncHandler(async (req, res) => {
  const recipes = await prisma.recipe.findMany({
    where: { userId: null },
    select: { tags: true },
  })

  const allTags = recipes.flatMap(recipe => recipe.tags)
  const uniqueTags = [...new Set(allTags)]
  const categories = uniqueTags.map(tag => ({
    name: tag,
    count: allTags.filter(t => t === tag).length,
  })).sort((a, b) => b.count - a.count)

  res.json({
    success: true,
    data: categories,
  })
}))

export default router
