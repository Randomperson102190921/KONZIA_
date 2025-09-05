import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

// Import routes
import authRoutes from './routes/auth'
import shoppingListRoutes from './routes/shoppingList'
import budgetRoutes from './routes/budget'
import analyticsRoutes from './routes/analytics'
import recipeRoutes from './routes/recipes'
import userRoutes from './routes/user'

// Import middleware
import { errorHandler } from './middleware/errorHandler'
import { notFound } from './middleware/notFound'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
    },
  },
}))

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

app.use(limiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Compression middleware
app.use(compression())

// Logging middleware
app.use(morgan('combined'))

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/shopping-list', shoppingListRoutes)
app.use('/api/budget', budgetRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/recipes', recipeRoutes)
app.use('/api/user', userRoutes)

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'KONZIA 2.0 API',
    version: '2.0.0',
    description: 'Smart Grocery Tracker API',
    endpoints: {
      auth: '/api/auth',
      shoppingList: '/api/shopping-list',
      budget: '/api/budget',
      analytics: '/api/analytics',
      recipes: '/api/recipes',
      user: '/api/user',
    },
    documentation: 'https://docs.konzia.com',
  })
})

// 404 handler
app.use(notFound)

// Error handling middleware
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🔗 Health check: http://localhost:${PORT}/health`)
  console.log(`📚 API docs: http://localhost:${PORT}/api`)
})

export default app
