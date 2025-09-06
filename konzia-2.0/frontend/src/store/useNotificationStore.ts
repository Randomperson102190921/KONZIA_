import { create } from 'zustand'
import { Notification } from '@/types'

interface NotificationState {
  notifications: Notification[]
}

interface NotificationActions {
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  clearAllNotifications: () => void
  showSuccess: (title: string, message: string, duration?: number) => void
  showError: (title: string, message: string, duration?: number) => void
  showWarning: (title: string, message: string, duration?: number) => void
  showInfo: (title: string, message: string, duration?: number) => void
}

type NotificationStore = NotificationState & NotificationActions

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  // Initial state
  notifications: [],

  // Actions
  addNotification: (notificationData) => {
    const notification: Notification = {
      ...notificationData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      duration: notificationData.duration || 5000,
    }
    
    set((state) => ({
      notifications: [...state.notifications, notification],
    }))
    
    // Auto-remove notification after duration
    if (notification.duration > 0) {
      setTimeout(() => {
        get().removeNotification(notification.id)
      }, notification.duration)
    }
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((notification) => notification.id !== id),
    }))
  },

  clearAllNotifications: () => {
    set({ notifications: [] })
  },

  showSuccess: (title, message, duration = 5000) => {
    get().addNotification({
      type: 'success',
      title,
      message,
      duration,
    })
  },

  showError: (title, message, duration = 7000) => {
    get().addNotification({
      type: 'error',
      title,
      message,
      duration,
    })
  },

  showWarning: (title, message, duration = 6000) => {
    get().addNotification({
      type: 'warning',
      title,
      message,
      duration,
    })
  },

  showInfo: (title, message, duration = 5000) => {
    get().addNotification({
      type: 'info',
      title,
      message,
      duration,
    })
  },
}))
