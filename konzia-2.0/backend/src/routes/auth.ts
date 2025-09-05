import express from 'express'
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  deleteAccount,
} from '../controllers/authController'
import { authenticate } from '../middleware/auth'
import {
  validateLogin,
  validateSignup,
  validateUserProfile,
} from '../middleware/validation'

const router = express.Router()

// Public routes
router.post('/register', validateSignup, register)
router.post('/login', validateLogin, login)

// Protected routes
router.use(authenticate) // All routes below require authentication

router.get('/me', getMe)
router.put('/profile', validateUserProfile, updateProfile)
router.put('/password', changePassword)
router.post('/logout', logout)
router.delete('/account', deleteAccount)

export default router
