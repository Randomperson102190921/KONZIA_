import { Request, Response, NextFunction } from 'express'
import { body, validationResult } from 'express-validator'

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array(),
    })
  }
  
  next()
}

// Auth validation rules
export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  handleValidationErrors,
]

export const validateSignup = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password')
      }
      return true
    }),
  handleValidationErrors,
]

// Shopping list validation rules
export const validateShoppingItem = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Item name must be between 1 and 100 characters'),
  body('category')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category must be between 1 and 50 characters'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
  body('unit')
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('Unit must be between 1 and 20 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH'])
    .withMessage('Priority must be LOW, MEDIUM, or HIGH'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must be less than 500 characters'),
  handleValidationErrors,
]

// Budget validation rules
export const validateBudgetItem = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Category name must be between 1 and 100 characters'),
  body('limit')
    .isFloat({ min: 0 })
    .withMessage('Budget limit must be a positive number'),
  body('spent')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Spent amount must be a positive number'),
  body('color')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Color must be a valid hex color code'),
  handleValidationErrors,
]

// Recipe validation rules
export const validateRecipe = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Recipe title must be between 1 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Description must be between 1 and 500 characters'),
  body('prepTime')
    .isInt({ min: 0 })
    .withMessage('Prep time must be a non-negative integer'),
  body('cookTime')
    .isInt({ min: 0 })
    .withMessage('Cook time must be a non-negative integer'),
  body('servings')
    .isInt({ min: 1 })
    .withMessage('Servings must be a positive integer'),
  body('difficulty')
    .isIn(['EASY', 'MEDIUM', 'HARD'])
    .withMessage('Difficulty must be EASY, MEDIUM, or HARD'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('ingredients')
    .isArray({ min: 1 })
    .withMessage('Recipe must have at least one ingredient'),
  body('instructions')
    .isArray({ min: 1 })
    .withMessage('Recipe must have at least one instruction'),
  handleValidationErrors,
]

// User profile validation rules
export const validateUserProfile = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  handleValidationErrors,
]
