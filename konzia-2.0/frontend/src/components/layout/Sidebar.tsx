import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HomeIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  BookOpenIcon,
  Cog6ToothIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { NavItem } from '@/types'
import { cn } from '@/utils/cn'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  isMobile: boolean
}

const navigation: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
  },
  {
    id: 'shopping-list',
    label: 'Shopping List',
    href: '/shopping-list',
    icon: ShoppingBagIcon,
  },
  {
    id: 'budget',
    label: 'Budget',
    href: '/budget',
    icon: CurrencyDollarIcon,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/analytics',
    icon: ChartBarIcon,
  },
  {
    id: 'recipes',
    label: 'Recipes',
    href: '/recipes',
    icon: BookOpenIcon,
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: Cog6ToothIcon,
  },
]

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isMobile }) => {
  const location = useLocation()

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-700 text-white">
            <svg
              className="h-5 w-5"
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
          <span className="ml-2 text-xl font-bold text-gray-900 dark:text-gray-100">
            KONZIA
          </span>
        </div>
        
        {isMobile && (
          <button
            type="button"
            className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:hover:bg-gray-700"
            onClick={onClose}
          >
            <span className="sr-only">Close sidebar</span>
            <XMarkIcon className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.id}
              to={item.href}
              className={cn(
                'sidebar-item group relative',
                isActive && 'active'
              )}
              onClick={isMobile ? onClose : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="ml-3">{item.label}</span>
              
              {item.badge && (
                <span className="ml-auto rounded-full bg-primary-100 px-2 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/20 dark:text-primary-400">
                  {item.badge}
                </span>
              )}
              
              {isActive && (
                <motion.div
                  className="absolute left-0 top-0 h-full w-1 bg-primary-700 rounded-r"
                  layoutId="activeIndicator"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <p>KONZIA 2.0</p>
          <p>Smart Grocery Tracker</p>
        </div>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <motion.div
        data-sidebar
        className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg dark:bg-gray-800"
        initial={{ x: -256 }}
        animate={{ x: isOpen ? 0 : -256 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {sidebarContent}
      </motion.div>
    )
  }

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-64 lg:flex-col">
      <div className="flex flex-grow flex-col overflow-y-auto bg-white shadow-lg dark:bg-gray-800">
        {sidebarContent}
      </div>
    </div>
  )
}
