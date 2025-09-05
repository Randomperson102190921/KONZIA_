import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { useNotificationStore } from '@/store/useNotificationStore'
import { cn } from '@/utils/cn'

const iconMap = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
}

const colorMap = {
  success: 'text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800',
  error: 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800',
  warning: 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-800',
  info: 'text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-800',
}

interface ToastItemProps {
  notification: {
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message: string
    action?: {
      label: string
      onClick: () => void
    }
  }
  onRemove: (id: string) => void
}

const ToastItem: React.FC<ToastItemProps> = ({ notification, onRemove }) => {
  const Icon = iconMap[notification.type]
  const colors = colorMap[notification.type]

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'toast max-w-sm',
        colors
      )}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon className="h-5 w-5" />
        </div>
        
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium">
            {notification.title}
          </h3>
          <p className="mt-1 text-sm opacity-90">
            {notification.message}
          </p>
          
          {notification.action && (
            <div className="mt-3">
              <button
                type="button"
                className="text-sm font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={notification.action.onClick}
              >
                {notification.action.label}
              </button>
            </div>
          )}
        </div>
        
        <div className="ml-4 flex-shrink-0">
          <button
            type="button"
            className="inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            onClick={() => onRemove(notification.id)}
          >
            <span className="sr-only">Close</span>
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export const Toast: React.FC = () => {
  const { notifications, removeNotification } = useNotificationStore()

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <div key={notification.id} className="pointer-events-auto">
            <ToastItem
              notification={notification}
              onRemove={removeNotification}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
