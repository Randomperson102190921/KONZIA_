import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <motion.div
        className="max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardContent className="text-center py-12">
            <motion.div
              className="mb-8"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="mx-auto h-24 w-24 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                <span className="text-4xl font-bold text-primary-700 dark:text-primary-400">404</span>
              </div>
            </motion.div>
            
            <motion.h1
              className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Page Not Found
            </motion.h1>
            
            <motion.p
              className="text-gray-600 dark:text-gray-400 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-3 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Button as={Link} to="/dashboard">
                <HomeIcon className="mr-2 h-4 w-4" />
                Go Home
              </Button>
              
              <Button
                variant="outline"
                onClick={() => window.history.back()}
              >
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
