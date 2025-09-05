import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ChartBarIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline'
import { useShoppingListSelectors } from '@/store/useShoppingListStore'
import { useBudgetSelectors } from '@/store/useBudgetStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { cn } from '@/utils/cn'

// Mock Chart.js components for demo
const LineChart = ({ data, options }: any) => (
  <div className="h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
    <div className="text-center">
      <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Line Chart</p>
      <p className="text-xs text-gray-400">Mock data visualization</p>
    </div>
  </div>
)

const DoughnutChart = ({ data, options }: any) => (
  <div className="h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
    <div className="text-center">
      <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Doughnut Chart</p>
      <p className="text-xs text-gray-400">Mock data visualization</p>
    </div>
  </div>
)

const BarChart = ({ data, options }: any) => (
  <div className="h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
    <div className="text-center">
      <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Bar Chart</p>
      <p className="text-xs text-gray-400">Mock data visualization</p>
    </div>
  </div>
)

export const AnalyticsPage: React.FC = () => {
  const { stats, filteredAndSortedItems } = useShoppingListSelectors()
  const { categoryBreakdown, totalSpent, monthlyLimit, budgetProgress } = useBudgetSelectors()
  
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  // Mock data generation
  const generateSpendingData = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365
    return Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      amount: Math.random() * 50 + 10,
    }))
  }

  const spendingData = generateSpendingData()
  const totalSpending = spendingData.reduce((sum, item) => sum + item.amount, 0)
  const averageDaily = totalSpending / spendingData.length

  // Category breakdown data
  const categoryData = {
    labels: categoryBreakdown.map(cat => cat.name),
    datasets: [{
      data: categoryBreakdown.map(cat => cat.spent),
      backgroundColor: categoryBreakdown.map(cat => cat.color),
      borderWidth: 0,
    }]
  }

  // Monthly trends data
  const monthlyTrends = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2024, i).toLocaleDateString('en-US', { month: 'short' }),
    spent: Math.random() * 500 + 200,
    budget: monthlyLimit,
  }))

  // Top items data
  const topItems = filteredAndSortedItems
    .filter(item => item.price && item.isCompleted)
    .sort((a, b) => (b.price || 0) - (a.price || 0))
    .slice(0, 5)

  const analyticsCards = [
    {
      title: 'Total Spent',
      value: `$${totalSpent.toFixed(2)}`,
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: CurrencyDollarIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Average Daily',
      value: `$${averageDaily.toFixed(2)}`,
      change: '-2.3%',
      changeType: 'negative' as const,
      icon: TrendingUpIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Items Purchased',
      value: stats.completed.toString(),
      change: '+8.1%',
      changeType: 'positive' as const,
      icon: ShoppingBagIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      title: 'Budget Used',
      value: `${budgetProgress.toFixed(0)}%`,
      change: budgetProgress > 100 ? 'Over budget' : 'On track',
      changeType: budgetProgress > 100 ? 'negative' as const : 'positive' as const,
      icon: ChartBarIcon,
      color: budgetProgress > 100 ? 'text-red-600' : 'text-orange-600',
      bgColor: budgetProgress > 100 ? 'bg-red-100 dark:bg-red-900/20' : 'bg-orange-100 dark:bg-orange-900/20',
    },
  ]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <LoadingSkeleton className="h-8 w-48" />
            <LoadingSkeleton className="h-4 w-64 mt-2" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <LoadingSkeleton className="h-12 w-12 rounded-lg mb-4" />
                <LoadingSkeleton className="h-4 w-24 mb-2" />
                <LoadingSkeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Insights into your grocery spending and shopping patterns
          </p>
        </div>
        
        <div className="flex space-x-2">
          {(['7d', '30d', '90d', '1y'] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {analyticsCards.map((card, index) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${card.bgColor}`}>
                      <Icon className={`h-6 w-6 ${card.color}`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {card.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {card.value}
                      </p>
                      <div className="flex items-center mt-1">
                        {card.changeType === 'positive' ? (
                          <TrendingUpIcon className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDownIcon className="h-4 w-4 text-red-600" />
                        )}
                        <span className={cn(
                          'ml-1 text-sm font-medium',
                          card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                        )}>
                          {card.change}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Spending Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Spending Trend</CardTitle>
              <CardDescription>
                Daily spending over the selected time period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart
                data={{
                  labels: spendingData.map(item => item.date),
                  datasets: [{
                    label: 'Daily Spending',
                    data: spendingData.map(item => item.amount),
                    borderColor: '#006400',
                    backgroundColor: 'rgba(0, 100, 0, 0.1)',
                    tension: 0.4,
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
              <CardDescription>
                Distribution of spending across categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DoughnutChart
                data={categoryData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Monthly Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
              <CardDescription>
                Monthly spending vs budget over the year
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                data={{
                  labels: monthlyTrends.map(trend => trend.month),
                  datasets: [
                    {
                      label: 'Spent',
                      data: monthlyTrends.map(trend => trend.spent),
                      backgroundColor: '#006400',
                    },
                    {
                      label: 'Budget',
                      data: monthlyTrends.map(trend => trend.budget),
                      backgroundColor: '#E0E0E0',
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Top Purchased Items</CardTitle>
              <CardDescription>
                Most expensive items you've bought
              </CardDescription>
            </CardHeader>
            <CardContent>
              {topItems.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    No completed items with prices yet
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {topItems.map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.category} • {item.quantity} {item.unit}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-gray-100">
                          ${item.price?.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.completedAt && new Date(item.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Category Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Category Details</CardTitle>
            <CardDescription>
              Detailed breakdown of spending by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            {categoryBreakdown.length === 0 ? (
              <div className="text-center py-8">
                <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  No budget categories set up yet
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {categoryBreakdown.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border border-gray-200 rounded-lg dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">
                          {category.name}
                        </h3>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-gray-100">
                          ${category.spent.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          of ${category.limit.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min(category.percentage, 100)}%`,
                          backgroundColor: category.color 
                        }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
                      <span>{category.percentage.toFixed(0)}% used</span>
                      <span>${category.remaining.toFixed(2)} remaining</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
