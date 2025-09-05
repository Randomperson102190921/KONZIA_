import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { asyncHandler, createError } from '../middleware/errorHandler'

const prisma = new PrismaClient()

// Generate JWT token
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  })
}

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    throw createError('User already exists with this email', 400)
  }

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      createdAt: true,
    },
  })

  // Generate token
  const token = generateToken(user.id)

  // Set cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  })

  res.status(201).json({
    success: true,
    data: {
      user,
      token,
    },
    message: 'User registered successfully',
  })
})

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    throw createError('Invalid credentials', 401)
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    throw createError('Invalid credentials', 401)
  }

  // Generate token
  const token = generateToken(user.id)

  // Set cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  })

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
      token,
    },
    message: 'Login successful',
  })
})

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
  })

  res.json({
    success: true,
    message: 'Logout successful',
  })
})

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req: any, res: Response) => {
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

  res.json({
    success: true,
    data: { user },
  })
})

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = asyncHandler(async (req: any, res: Response) => {
  const { name, email } = req.body

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      name,
      email,
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
})

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
export const changePassword = asyncHandler(async (req: any, res: Response) => {
  const { currentPassword, newPassword } = req.body

  // Get user with password
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  })

  if (!user) {
    throw createError('User not found', 404)
  }

  // Check current password
  const isMatch = await bcrypt.compare(currentPassword, user.password)

  if (!isMatch) {
    throw createError('Current password is incorrect', 400)
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(newPassword, salt)

  // Update password
  await prisma.user.update({
    where: { id: req.user.id },
    data: { password: hashedPassword },
  })

  res.json({
    success: true,
    message: 'Password changed successfully',
  })
})

// @desc    Delete user account
// @route   DELETE /api/auth/account
// @access  Private
export const deleteAccount = asyncHandler(async (req: any, res: Response) => {
  await prisma.user.delete({
    where: { id: req.user.id },
  })

  res.cookie('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
  })

  res.json({
    success: true,
    message: 'Account deleted successfully',
  })
})
