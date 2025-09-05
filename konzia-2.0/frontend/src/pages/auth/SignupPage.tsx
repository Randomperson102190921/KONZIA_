import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/useAuthStore'
import { useNotificationStore } from '@/store/useNotificationStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { SignupCredentials } from '@/types'
import { cn } from '@/utils/cn'

export const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState<SignupCredentials>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Partial<SignupCredentials>>({})
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  
  const { signup, isLoading } = useAuthStore()
  const { showError, showSuccess } = useNotificationStore()
  const navigate = useNavigate()

  const validateForm = (): boolean => {
    const newErrors: Partial<SignupCredentials> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0 && agreedToTerms
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      if (!agreedToTerms) {
        showError('Terms Required', 'Please agree to the Terms of Service and Privacy Policy')
      }
      return
    }
    
    try {
      await signup(formData)
      showSuccess('Welcome to KONZIA!', 'Your account has been created successfully')
      navigate('/dashboard', { replace: true })
    } catch (error) {
      showError('Signup Failed', error instanceof Error ? error.message : 'An error occurred')
    }
  }

  const handleInputChange = (field: keyof SignupCredentials) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-700 text-white">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                />
              </svg>
            </div>
            <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
            <CardDescription>
              Join KONZIA and start tracking your groceries smartly
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Full name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange('name')}
                error={errors.name}
                required
              />
              
              <Input
                label="Email address"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange('email')}
                error={errors.email}
                required
              />
              
              <Input
                label="Password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleInputChange('password')}
                error={errors.password}
                helperText="Must be at least 6 characters"
                required
              />
              
              <Input
                label="Confirm password"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                error={errors.confirmPassword}
                required
              />
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-gray-600 dark:text-gray-400">
                    I agree to the{' '}
                    <Link
                      to="/terms"
                      className="text-primary-600 hover:text-primary-500 dark:text-primary-400"
                    >
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link
                      to="/privacy"
                      className="text-primary-600 hover:text-primary-500 dark:text-primary-400"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full"
                loading={isLoading}
                disabled={isLoading || !agreedToTerms}
              >
                Create account
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
