import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HomeIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline'
import { NavItem } from '@/types'
import { cn } from '@/utils/cn'

const bottomNavigation: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
  },
  {
    id: 'shopping-list',
    label: 'List',
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
]

export const BottomNav: React.FC = () => {
  const location = useLocation()

  return (
    <div className="bottom-nav safe-area-inset-bottom">
      {bottomNavigation.map((item) => {
        const isActive = location.pathname === item.href
        const Icon = item.icon
        
        return (
          <Link
            key={item.id}
            to={item.href}
            className={cn(
              'bottom-nav-item group relative',
              isActive && 'active'
            )}
          >
            <div className="flex flex-col items-center space-y-1">
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-700 text-xs text-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </div>
            
            {isActive && (
              <motion.div
                className="absolute bottom-0 left-1/2 h-1 w-8 -translate-x-1/2 rounded-t-full bg-primary-700"
                layoutId="bottomNavIndicator"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </Link>
        )
      })}
    </div>
  )
}
