import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    name: string
  }
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies?.token

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.',
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
      },
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token. User not found.',
      })
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid token.',
    })
  }
}

export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies?.token

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
        },
      })

      if (user) {
        req.user = user
      }
    }

    next()
  } catch (error) {
    // Continue without authentication
    next()
  }
}
