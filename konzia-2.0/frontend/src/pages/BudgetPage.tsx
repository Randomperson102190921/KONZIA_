import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  CurrencyDollarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'
import { useBudgetSelectors } from '@/store/useBudgetStore'
import { useNotificationStore } from '@/store/useNotificationStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { BudgetCategory } from '@/types'
import { cn } from '@/utils/cn'

export const BudgetPage: React.FC = () => {
  const {
    monthlyLimit,
    spent,
    remaining,
    categoryBreakdown,
    totalSpent,
    totalLimit,
    isOverBudget,
    budgetProgress,
    setMonthlyLimit,
    addCategory,
    updateCategory,
    deleteCategory,
    updateSpent,
    resetBudget,
    initializeBudget,
  } = useBudgetSelectors()
  
  const { showSuccess, showError } = useNotificationStore()
  
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false)
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false)
  const [isEditBudgetModalOpen, setIsEditBudgetModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<BudgetCategory | null>(null)
  const [newCategory, setNewCategory] = useState<Partial<BudgetCategory>>({
    name: '',
    limit: 0,
    color: '#006400',
  })
  const [newMonthlyLimit, setNewMonthlyLimit] = useState(monthlyLimit)

  const colors = [
    '#006400', '#228B22', '#32CD32', '#90EE90', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'
  ]

  useEffect(() => {
    initializeBudget()
  }, [initializeBudget])

  useEffect(() => {
    setNewMonthlyLimit(monthlyLimit)
  }, [monthlyLimit])

  const handleAddCategory = () => {
    if (!newCategory.name?.trim()) {
      showError('Validation Error', 'Category name is required')
      return
    }

    if (!newCategory.limit || newCategory.limit <= 0) {
      showError('Validation Error', 'Category limit must be greater than 0')
      return
    }

    addCategory({
      name: newCategory.name.trim(),
      limit: newCategory.limit,
      spent: 0,
      color: newCategory.color || '#006400',
    })

    setNewCategory({
      name: '',
      limit: 0,
      color: '#006400',
    })
    setIsAddCategoryModalOpen(false)
    showSuccess('Category Added', 'New budget category has been created')
  }

  const handleEditCategory = (category: BudgetCategory) => {
    setEditingCategory(category)
    setNewCategory({
      name: category.name,
      limit: category.limit,
      spent: category.spent,
      color: category.color,
    })
    setIsEditCategoryModalOpen(true)
  }

  const handleUpdateCategory = () => {
    if (!editingCategory || !newCategory.name?.trim()) {
      showError('Validation Error', 'Category name is required')
      return
    }

    if (!newCategory.limit || newCategory.limit <= 0) {
      showError('Validation Error', 'Category limit must be greater than 0')
      return
    }

    updateCategory(editingCategory.id, {
      name: newCategory.name.trim(),
      limit: newCategory.limit,
      spent: newCategory.spent || 0,
      color: newCategory.color || '#006400',
    })

    setEditingCategory(null)
    setNewCategory({
      name: '',
      limit: 0,
      color: '#006400',
    })
    setIsEditCategoryModalOpen(false)
    showSuccess('Category Updated', 'Budget category has been updated')
  }

  const handleDeleteCategory = (id: string) => {
    deleteCategory(id)
    showSuccess('Category Deleted', 'Budget category has been removed')
  }

  const handleUpdateMonthlyLimit = () => {
    if (newMonthlyLimit <= 0) {
      showError('Validation Error', 'Monthly limit must be greater than 0')
      return
    }

    setMonthlyLimit(newMonthlyLimit)
    setIsEditBudgetModalOpen(false)
    showSuccess('Budget Updated', 'Monthly budget limit has been updated')
  }

  const handleResetBudget = () => {
    resetBudget()
    showSuccess('Budget Reset', 'All spending has been reset to zero')
  }

  const handleSpentChange = (categoryId: string, amount: string) => {
    const newAmount = parseFloat(amount) || 0
    updateSpent(categoryId, newAmount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Budget Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your monthly grocery budget and spending
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsEditBudgetModalOpen(true)}
          >
            <PencilIcon className="mr-2 h-4 w-4" />
            Edit Budget
          </Button>
          <Button onClick={() => setIsAddCategoryModalOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CurrencyDollarIcon className="mr-2 h-5 w-5" />
                Monthly Budget
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                ${monthlyLimit.toFixed(2)}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total monthly limit
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CurrencyDollarIcon className="mr-2 h-5 w-5" />
                Total Spent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={cn(
                'text-3xl font-bold',
                isOverBudget ? 'text-red-600' : 'text-gray-900 dark:text-gray-100'
              )}>
                ${totalSpent.toFixed(2)}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {budgetProgress.toFixed(0)}% of budget used
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {isOverBudget ? (
                  <ExclamationTriangleIcon className="mr-2 h-5 w-5 text-red-600" />
                ) : (
                  <CheckCircleIcon className="mr-2 h-5 w-5 text-green-600" />
                )}
                Remaining
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={cn(
                'text-3xl font-bold',
                isOverBudget ? 'text-red-600' : 'text-green-600'
              )}>
                ${Math.abs(remaining).toFixed(2)}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isOverBudget ? 'Over budget' : 'Available to spend'}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Budget Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Budget Progress</CardTitle>
            <CardDescription>
              Visual overview of your spending against your monthly budget
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Monthly Progress
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {budgetProgress.toFixed(0)}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                <motion.div
                  className={cn(
                    'h-3 rounded-full transition-all duration-500',
                    isOverBudget ? 'bg-red-500' : 'bg-primary-500'
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(budgetProgress, 100)}%` }}
                  transition={{ delay: 0.5, duration: 1 }}
                />
              </div>
              
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>${totalSpent.toFixed(2)} spent</span>
                <span>${monthlyLimit.toFixed(2)} budget</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Category Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Category Breakdown</CardTitle>
                <CardDescription>
                  Track spending by category
                </CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={handleResetBudget}
                className="text-red-600 hover:text-red-700"
              >
                Reset All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {categoryBreakdown.length === 0 ? (
              <div className="text-center py-8">
                <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                  No categories yet
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Create your first budget category to get started
                </p>
                <Button onClick={() => setIsAddCategoryModalOpen(true)} className="mt-4">
                  Add Category
                </Button>
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
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="p-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          ${category.spent.toFixed(2)} of ${category.limit.toFixed(2)}
                        </span>
                        <span className={cn(
                          'font-medium',
                          category.isOverLimit ? 'text-red-600' : 'text-gray-900 dark:text-gray-100'
                        )}>
                          {category.percentage.toFixed(0)}%
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div
                          className={cn(
                            'h-2 rounded-full transition-all duration-300',
                            category.isOverLimit ? 'bg-red-500' : 'bg-primary-500'
                          )}
                          style={{ 
                            width: `${Math.min(category.percentage, 100)}%`,
                            backgroundColor: category.color 
                          }}
                        />
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <input
                            type="number"
                            placeholder="0.00"
                            value={category.spent}
                            onChange={(e) => handleSpentChange(category.id, e.target.value)}
                            className="input text-sm"
                            step="0.01"
                            min="0"
                          />
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Remaining: ${category.remaining.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Add Category Modal */}
      <Modal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        title="Add Budget Category"
      >
        <div className="space-y-4">
          <Input
            label="Category Name"
            placeholder="e.g., Groceries"
            value={newCategory.name || ''}
            onChange={(value) => setNewCategory(prev => ({ ...prev, name: value }))}
            required
          />
          
          <Input
            label="Monthly Limit"
            type="number"
            placeholder="0.00"
            value={newCategory.limit?.toString() || ''}
            onChange={(value) => setNewCategory(prev => ({ ...prev, limit: parseFloat(value) || 0 }))}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color
            </label>
            <div className="grid grid-cols-5 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={cn(
                    'w-8 h-8 rounded-full border-2 transition-all',
                    newCategory.color === color ? 'border-gray-900 dark:border-gray-100' : 'border-gray-300 dark:border-gray-600'
                  )}
                  style={{ backgroundColor: color }}
                  onClick={() => setNewCategory(prev => ({ ...prev, color }))}
                />
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsAddCategoryModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddCategory}>
              Add Category
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={isEditCategoryModalOpen}
        onClose={() => setIsEditCategoryModalOpen(false)}
        title="Edit Budget Category"
      >
        <div className="space-y-4">
          <Input
            label="Category Name"
            placeholder="e.g., Groceries"
            value={newCategory.name || ''}
            onChange={(value) => setNewCategory(prev => ({ ...prev, name: value }))}
            required
          />
          
          <Input
            label="Monthly Limit"
            type="number"
            placeholder="0.00"
            value={newCategory.limit?.toString() || ''}
            onChange={(value) => setNewCategory(prev => ({ ...prev, limit: parseFloat(value) || 0 }))}
            required
          />
          
          <Input
            label="Current Spent"
            type="number"
            placeholder="0.00"
            value={newCategory.spent?.toString() || ''}
            onChange={(value) => setNewCategory(prev => ({ ...prev, spent: parseFloat(value) || 0 }))}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color
            </label>
            <div className="grid grid-cols-5 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={cn(
                    'w-8 h-8 rounded-full border-2 transition-all',
                    newCategory.color === color ? 'border-gray-900 dark:border-gray-100' : 'border-gray-300 dark:border-gray-600'
                  )}
                  style={{ backgroundColor: color }}
                  onClick={() => setNewCategory(prev => ({ ...prev, color }))}
                />
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsEditCategoryModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateCategory}>
              Update Category
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Budget Modal */}
      <Modal
        isOpen={isEditBudgetModalOpen}
        onClose={() => setIsEditBudgetModalOpen(false)}
        title="Edit Monthly Budget"
      >
        <div className="space-y-4">
          <Input
            label="Monthly Budget Limit"
            type="number"
            placeholder="0.00"
            value={newMonthlyLimit.toString()}
            onChange={(value) => setNewMonthlyLimit(parseFloat(value) || 0)}
            required
          />
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>Current spending: ${totalSpent.toFixed(2)}</p>
            <p>Current limit: ${monthlyLimit.toFixed(2)}</p>
            {newMonthlyLimit !== monthlyLimit && (
              <p className="text-primary-600 dark:text-primary-400">
                New limit: ${newMonthlyLimit.toFixed(2)}
              </p>
            )}
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsEditBudgetModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateMonthlyLimit}>
              Update Budget
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
