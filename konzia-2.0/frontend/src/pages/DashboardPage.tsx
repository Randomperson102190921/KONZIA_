import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  PlusIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import { useShoppingListStore } from '@/store/useShoppingListStore'
import { useBudgetStore } from '@/store/useBudgetStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'

export const DashboardPage: React.FC = () => {
  const { stats, filteredAndSortedItems, initializeList } = useShoppingListStore()
  const { budgetProgress, isOverBudget, totalSpent, monthlyLimit, initializeBudget } = useBudgetStore()

  useEffect(() => {
    initializeList()
    initializeBudget()
  }, [initializeList, initializeBudget])

  const recentItems = filteredAndSortedItems.slice(0, 5)
  const completedToday = stats.completed

  const quickStats = [
    {
      title: 'Active Items',
      value: stats.active,
      icon: ClockIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Completed Today',
      value: completedToday,
      icon: CheckCircleIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Total Spent',
      value: `$${stats.totalSpent.toFixed(2)}`,
      icon: CurrencyDollarIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      title: 'Budget Used',
      value: `${budgetProgress.toFixed(0)}%`,
      icon: ChartBarIcon,
      color: isOverBudget ? 'text-red-600' : 'text-orange-600',
      bgColor: isOverBudget ? 'bg-red-100 dark:bg-red-900/20' : 'bg-orange-100 dark:bg-orange-900/20',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's your grocery tracking overview.
          </p>
        </div>
        <Button as={Link} to="/shopping-list" className="hidden sm:flex">
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Budget Overview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CurrencyDollarIcon className="mr-2 h-5 w-5" />
                Budget Overview
              </CardTitle>
              <CardDescription>
                Your spending for this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Spent: ${totalSpent.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Budget: ${monthlyLimit.toFixed(2)}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isOverBudget ? 'bg-red-500' : 'bg-primary-500'
                    }`}
                    style={{ width: `${Math.min(budgetProgress, 100)}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className={isOverBudget ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'}>
                    {isOverBudget ? 'Over budget!' : 'On track'}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {budgetProgress.toFixed(0)}%
                  </span>
                </div>
              </div>
              
              <div className="mt-4">
                <Button as={Link} to="/budget" variant="outline" className="w-full">
                  View Budget Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Items */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingBagIcon className="mr-2 h-5 w-5" />
                Recent Items
              </CardTitle>
              <CardDescription>
                Your latest shopping list items
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentItems.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    No items in your shopping list yet
                  </p>
                  <Button as={Link} to="/shopping-list" className="mt-4">
                    Add Your First Item
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        item.isCompleted 
                          ? 'bg-green-100 text-green-600 dark:bg-green-900/20' 
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}>
                        {item.isCompleted ? (
                          <CheckCircleIcon className="h-4 w-4" />
                        ) : (
                          <ClockIcon className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${
                          item.isCompleted 
                            ? 'line-through text-gray-500 dark:text-gray-400' 
                            : 'text-gray-900 dark:text-gray-100'
                        }`}>
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.category} • {item.quantity} {item.unit}
                        </p>
                      </div>
                      {item.price && (
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          ${item.price.toFixed(2)}
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
              
              <div className="mt-4">
                <Button as={Link} to="/shopping-list" variant="outline" className="w-full">
                  View All Items
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks to help you manage your groceries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Button as={Link} to="/shopping-list" variant="outline" className="h-auto p-4 flex-col">
                <ShoppingBagIcon className="mb-2 h-6 w-6" />
                <span>Add Item</span>
              </Button>
              
              <Button as={Link} to="/budget" variant="outline" className="h-auto p-4 flex-col">
                <CurrencyDollarIcon className="mb-2 h-6 w-6" />
                <span>Set Budget</span>
              </Button>
              
              <Button as={Link} to="/analytics" variant="outline" className="h-auto p-4 flex-col">
                <ChartBarIcon className="mb-2 h-6 w-6" />
                <span>View Analytics</span>
              </Button>
              
              <Button as={Link} to="/recipes" variant="outline" className="h-auto p-4 flex-col">
                <PlusIcon className="mb-2 h-6 w-6" />
                <span>Find Recipes</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
