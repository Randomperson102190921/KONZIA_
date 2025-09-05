import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  PaintBrushIcon,
  TrashIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline'
import { useAuthStore } from '@/store/useAuthStore'
import { useThemeStore } from '@/store/useThemeStore'
import { useNotificationStore } from '@/store/useNotificationStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { cn } from '@/utils/cn'

export const SettingsPage: React.FC = () => {
  const { user, updateProfile, logout } = useAuthStore()
  const { mode, setMode } = useThemeStore()
  const { showSuccess, showError } = useNotificationStore()
  
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })
  const [notifications, setNotifications] = useState({
    budgetAlerts: true,
    priceDrops: true,
    expiryReminders: true,
    weeklyReports: false,
  })

  const handleUpdateProfile = () => {
    if (!profileData.name.trim()) {
      showError('Validation Error', 'Name is required')
      return
    }

    updateProfile(profileData)
    setIsProfileModalOpen(false)
    showSuccess('Profile Updated', 'Your profile has been updated successfully')
  }

  const handleDeleteAccount = () => {
    // In a real app, this would call an API
    showSuccess('Account Deleted', 'Your account has been deleted')
    logout()
  }

  const handleLogout = () => {
    logout()
    showSuccess('Logged Out', 'You have been successfully logged out')
  }

  const settingsSections = [
    {
      title: 'Account',
      icon: UserIcon,
      items: [
        {
          title: 'Profile Information',
          description: 'Update your personal details',
          action: () => setIsProfileModalOpen(true),
        },
        {
          title: 'Change Password',
          description: 'Update your password',
          action: () => showInfo('Coming Soon', 'Password change feature will be available soon'),
        },
        {
          title: 'Delete Account',
          description: 'Permanently delete your account',
          action: () => setIsDeleteModalOpen(true),
          danger: true,
        },
      ],
    },
    {
      title: 'Preferences',
      icon: Cog6ToothIcon,
      items: [
        {
          title: 'Theme',
          description: `Current: ${mode.charAt(0).toUpperCase() + mode.slice(1)}`,
          action: () => {},
          custom: (
            <div className="flex space-x-2">
              {(['light', 'dark', 'system'] as const).map((theme) => (
                <Button
                  key={theme}
                  variant={mode === theme ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setMode(theme)}
                >
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </Button>
              ))}
            </div>
          ),
        },
        {
          title: 'Language',
          description: 'English (US)',
          action: () => showInfo('Coming Soon', 'Language selection will be available soon'),
        },
        {
          title: 'Currency',
          description: 'USD ($)',
          action: () => showInfo('Coming Soon', 'Currency selection will be available soon'),
        },
      ],
    },
    {
      title: 'Notifications',
      icon: BellIcon,
      items: [
        {
          title: 'Budget Alerts',
          description: 'Get notified when approaching budget limits',
          action: () => {},
          custom: (
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.budgetAlerts}
                onChange={(e) => setNotifications(prev => ({ ...prev, budgetAlerts: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          ),
        },
        {
          title: 'Price Drops',
          description: 'Get notified about price changes',
          action: () => {},
          custom: (
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.priceDrops}
                onChange={(e) => setNotifications(prev => ({ ...prev, priceDrops: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          ),
        },
        {
          title: 'Expiry Reminders',
          description: 'Get reminded about expiring items',
          action: () => {},
          custom: (
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.expiryReminders}
                onChange={(e) => setNotifications(prev => ({ ...prev, expiryReminders: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          ),
        },
        {
          title: 'Weekly Reports',
          description: 'Receive weekly spending summaries',
          action: () => {},
          custom: (
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.weeklyReports}
                onChange={(e) => setNotifications(prev => ({ ...prev, weeklyReports: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          ),
        },
      ],
    },
    {
      title: 'Privacy & Security',
      icon: ShieldCheckIcon,
      items: [
        {
          title: 'Data Export',
          description: 'Download your data',
          action: () => showInfo('Coming Soon', 'Data export feature will be available soon'),
        },
        {
          title: 'Privacy Policy',
          description: 'Read our privacy policy',
          action: () => showInfo('Privacy Policy', 'Privacy policy will be available soon'),
        },
        {
          title: 'Terms of Service',
          description: 'Read our terms of service',
          action: () => showInfo('Terms of Service', 'Terms of service will be available soon'),
        },
      ],
    },
    {
      title: 'About',
      icon: InformationCircleIcon,
      items: [
        {
          title: 'App Version',
          description: '2.0.0',
          action: () => {},
        },
        {
          title: 'Help & Support',
          description: 'Get help and contact support',
          action: () => showInfo('Support', 'Support information will be available soon'),
        },
        {
          title: 'Sign Out',
          description: 'Sign out of your account',
          action: () => setIsLogoutModalOpen(true),
        },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingsSections.map((section, sectionIndex) => {
          const Icon = section.icon
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Icon className="mr-2 h-5 w-5" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-0">
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={item.title}
                      className={cn(
                        'flex items-center justify-between py-4',
                        itemIndex !== section.items.length - 1 && 'border-b border-gray-200 dark:border-gray-700'
                      )}
                    >
                      <div className="flex-1">
                        <h3 className={cn(
                          'text-sm font-medium',
                          item.danger ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'
                        )}>
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {item.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {item.custom ? (
                          item.custom
                        ) : (
                          <button
                            onClick={item.action}
                            className={cn(
                              'p-2 rounded-lg transition-colors',
                              item.danger
                                ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                            )}
                          >
                            <ArrowRightOnRectangleIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Profile Modal */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="Edit Profile"
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={profileData.name}
            onChange={(value) => setProfileData(prev => ({ ...prev, name: value }))}
            required
          />
          
          <Input
            label="Email"
            type="email"
            value={profileData.email}
            onChange={(value) => setProfileData(prev => ({ ...prev, email: value }))}
            disabled
            helperText="Email cannot be changed"
          />
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsProfileModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateProfile}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Account"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <TrashIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
            <div>
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Warning
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Are you sure you want to delete your account? This will remove all your shopping lists, 
            budget data, and preferences.
          </p>
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Account
            </Button>
          </div>
        </div>
      </Modal>

      {/* Logout Modal */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Sign Out"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Are you sure you want to sign out? You'll need to sign in again to access your data.
          </p>
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsLogoutModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
