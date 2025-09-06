import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSwipeable } from 'react-swipeable'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  PencilIcon,
} from '@heroicons/react/24/outline'
import { useShoppingListSelectors } from '@/store/useShoppingListStore'
import { useNotificationStore } from '@/store/useNotificationStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { ShoppingItem } from '@/types'
import { cn } from '@/utils/cn'

export const ShoppingListPage: React.FC = () => {
  const {
    filteredAndSortedItems,
    stats,
    filter,
    searchQuery,
    sortBy,
    sortOrder,
    setFilter,
    setSearchQuery,
    setSortBy,
    setSortOrder,
    addItem,
    updateItem,
    deleteItem,
    toggleItem,
    clearCompleted,
    duplicateItem,
    initializeList,
  } = useShoppingListSelectors()
  
  const { showSuccess, showError } = useNotificationStore()
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null)
  const [newItem, setNewItem] = useState<Partial<ShoppingItem>>({
    name: '',
    category: '',
    quantity: 1,
    unit: 'pieces',
    priority: 'medium',
    notes: '',
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    initializeList()
  }, [initializeList])

  const categories = [
    'Fruits', 'Vegetables', 'Dairy', 'Meat', 'Bakery', 'Pantry', 'Beverages', 'Snacks', 'Frozen', 'Other'
  ]

  const units = [
    'pieces', 'lbs', 'kg', 'g', 'oz', 'cups', 'tbsp', 'tsp', 'ml', 'l', 'gal', 'dozen', 'bag', 'box', 'can', 'bottle'
  ]

  const handleAddItem = () => {
    if (!newItem.name?.trim()) {
      showError('Validation Error', 'Item name is required')
      return
    }

    addItem({
      name: newItem.name.trim(),
      category: newItem.category || 'Other',
      quantity: newItem.quantity || 1,
      unit: newItem.unit || 'pieces',
      price: newItem.price,
      priority: newItem.priority || 'medium',
      notes: newItem.notes,
      isCompleted: false,
    })

    setNewItem({
      name: '',
      category: '',
      quantity: 1,
      unit: 'pieces',
      priority: 'medium',
      notes: '',
    })
    setIsAddModalOpen(false)
    showSuccess('Item Added', 'New item added to your shopping list')
  }

  const handleEditItem = (item: ShoppingItem) => {
    setEditingItem(item)
    setNewItem({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      price: item.price,
      priority: item.priority,
      notes: item.notes,
    })
    setIsEditModalOpen(true)
  }

  const handleUpdateItem = () => {
    if (!editingItem || !newItem.name?.trim()) {
      showError('Validation Error', 'Item name is required')
      return
    }

    updateItem(editingItem.id, {
      name: newItem.name.trim(),
      category: newItem.category || 'Other',
      quantity: newItem.quantity || 1,
      unit: newItem.unit || 'pieces',
      price: newItem.price,
      priority: newItem.priority || 'medium',
      notes: newItem.notes,
    })

    setEditingItem(null)
    setNewItem({
      name: '',
      category: '',
      quantity: 1,
      unit: 'pieces',
      priority: 'medium',
      notes: '',
    })
    setIsEditModalOpen(false)
    showSuccess('Item Updated', 'Item has been updated successfully')
  }

  const handleDeleteItem = (id: string) => {
    deleteItem(id)
    showSuccess('Item Deleted', 'Item has been removed from your list')
  }

  const handleToggleItem = (id: string) => {
    toggleItem(id)
    const item = filteredAndSortedItems.find(i => i.id === id)
    if (item) {
      showSuccess(
        item.isCompleted ? 'Item Unchecked' : 'Item Completed',
        `${item.name} has been ${item.isCompleted ? 'unchecked' : 'checked'}`
      )
    }
  }

  const handleClearCompleted = () => {
    clearCompleted()
    showSuccess('Completed Items Cleared', 'All completed items have been removed')
  }

  const handleDuplicateItem = (id: string) => {
    duplicateItem(id)
    showSuccess('Item Duplicated', 'Item has been duplicated')
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/20'
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700'
    }
  }

  const ItemCard = ({ item }: { item: ShoppingItem }) => {
    const swipeHandlers = useSwipeable({
      onSwipedLeft: () => handleDeleteItem(item.id),
      onSwipedRight: () => handleToggleItem(item.id),
      trackMouse: true,
    })

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="swipeable-item"
        {...swipeHandlers}
      >
        <Card className="group hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleToggleItem(item.id)}
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors',
                  item.isCompleted
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-gray-300 hover:border-primary-500 dark:border-gray-600'
                )}
              >
                {item.isCompleted && <CheckIcon className="h-4 w-4" />}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className={cn(
                    'text-sm font-medium truncate',
                    item.isCompleted
                      ? 'line-through text-gray-500 dark:text-gray-400'
                      : 'text-gray-900 dark:text-gray-100'
                  )}>
                    {item.name}
                  </h3>
                  <span className={cn(
                    'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                    getPriorityColor(item.priority)
                  )}>
                    {item.priority}
                  </span>
                </div>
                
                <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>{item.category}</span>
                  <span>•</span>
                  <span>{item.quantity} {item.unit}</span>
                  {item.price && (
                    <>
                      <span>•</span>
                      <span className="font-medium">${item.price.toFixed(2)}</span>
                    </>
                  )}
                </div>
                
                {item.notes && (
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    {item.notes}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEditItem(item)}
                  className="p-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDuplicateItem(item.id)}
                  className="p-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Shopping List
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {stats.total} items • {stats.active} active • {stats.completed} completed
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={setSearchQuery}
                icon={<MagnifyingGlassIcon className="h-4 w-4" />}
              />
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FunnelIcon className="mr-2 h-4 w-4" />
                Filters
              </Button>
              
              {stats.completed > 0 && (
                <Button
                  variant="outline"
                  onClick={handleClearCompleted}
                >
                  Clear Completed
                </Button>
              )}
            </div>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 space-y-4"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Filter
                  </label>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="input"
                  >
                    <option value="all">All Items</option>
                    <option value="active">Active Only</option>
                    <option value="completed">Completed Only</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="input"
                  >
                    <option value="name">Name</option>
                    <option value="category">Category</option>
                    <option value="priority">Priority</option>
                    <option value="createdAt">Date Added</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Order
                  </label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as any)}
                    className="input"
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Items List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredAndSortedItems.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                  {searchQuery ? 'No items found' : 'No items in your list'}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {searchQuery 
                    ? 'Try adjusting your search terms'
                    : 'Get started by adding your first item'
                  }
                </p>
                {!searchQuery && (
                  <Button onClick={() => setIsAddModalOpen(true)} className="mt-4">
                    Add Your First Item
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredAndSortedItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Add Item Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Item"
      >
        <div className="space-y-4">
          <Input
            label="Item Name"
            placeholder="e.g., Organic Bananas"
            value={newItem.name || ''}
            onChange={(value) => setNewItem(prev => ({ ...prev, name: value }))}
            required
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={newItem.category || ''}
                onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                className="input"
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={newItem.priority || 'medium'}
                onChange={(e) => setNewItem(prev => ({ ...prev, priority: e.target.value as any }))}
                className="input"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Quantity"
              type="number"
              placeholder="1"
              value={newItem.quantity?.toString() || '1'}
              onChange={(value) => setNewItem(prev => ({ ...prev, quantity: parseInt(value) || 1 }))}
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Unit
              </label>
              <select
                value={newItem.unit || 'pieces'}
                onChange={(e) => setNewItem(prev => ({ ...prev, unit: e.target.value }))}
                className="input"
              >
                {units.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>
          
          <Input
            label="Price (optional)"
            type="number"
            placeholder="0.00"
            value={newItem.price?.toString() || ''}
            onChange={(value) => setNewItem(prev => ({ ...prev, price: parseFloat(value) || undefined }))}
          />
          
          <Input
            label="Notes (optional)"
            placeholder="Any additional notes..."
            value={newItem.notes || ''}
            onChange={(value) => setNewItem(prev => ({ ...prev, notes: value }))}
          />
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddItem}>
              Add Item
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Item Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Item"
      >
        <div className="space-y-4">
          <Input
            label="Item Name"
            placeholder="e.g., Organic Bananas"
            value={newItem.name || ''}
            onChange={(value) => setNewItem(prev => ({ ...prev, name: value }))}
            required
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={newItem.category || ''}
                onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                className="input"
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={newItem.priority || 'medium'}
                onChange={(e) => setNewItem(prev => ({ ...prev, priority: e.target.value as any }))}
                className="input"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Quantity"
              type="number"
              placeholder="1"
              value={newItem.quantity?.toString() || '1'}
              onChange={(value) => setNewItem(prev => ({ ...prev, quantity: parseInt(value) || 1 }))}
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Unit
              </label>
              <select
                value={newItem.unit || 'pieces'}
                onChange={(e) => setNewItem(prev => ({ ...prev, unit: e.target.value }))}
                className="input"
              >
                {units.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>
          
          <Input
            label="Price (optional)"
            type="number"
            placeholder="0.00"
            value={newItem.price?.toString() || ''}
            onChange={(value) => setNewItem(prev => ({ ...prev, price: parseFloat(value) || undefined }))}
          />
          
          <Input
            label="Notes (optional)"
            placeholder="Any additional notes..."
            value={newItem.notes || ''}
            onChange={(value) => setNewItem(prev => ({ ...prev, notes: value }))}
          />
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateItem}>
              Update Item
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
