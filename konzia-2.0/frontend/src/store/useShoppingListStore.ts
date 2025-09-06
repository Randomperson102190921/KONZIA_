import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { ShoppingListState, ShoppingItem } from '@/types'
import { STORAGE_KEYS } from '@/types'

interface ShoppingListActions {
  addItem: (item: Omit<ShoppingItem, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateItem: (id: string, updates: Partial<ShoppingItem>) => void
  deleteItem: (id: string) => void
  toggleItem: (id: string) => void
  clearCompleted: () => void
  setFilter: (filter: ShoppingListState['filter']) => void
  setSearchQuery: (query: string) => void
  setSortBy: (sortBy: ShoppingListState['sortBy']) => void
  setSortOrder: (order: ShoppingListState['sortOrder']) => void
  bulkAddItems: (items: Omit<ShoppingItem, 'id' | 'createdAt' | 'updatedAt'>[]) => void
  duplicateItem: (id: string) => void
  clearError: () => void
  initializeList: () => void
}

type ShoppingListStore = ShoppingListState & ShoppingListActions

// Mock data for demo
const mockItems: ShoppingItem[] = [
  {
    id: '1',
    name: 'Organic Bananas',
    category: 'Fruits',
    quantity: 6,
    unit: 'pieces',
    price: 2.99,
    isCompleted: false,
    priority: 'high',
    notes: 'Look for ripe ones',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    name: 'Whole Milk',
    category: 'Dairy',
    quantity: 1,
    unit: 'gallon',
    price: 3.49,
    isCompleted: true,
    priority: 'medium',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    name: 'Chicken Breast',
    category: 'Meat',
    quantity: 2,
    unit: 'lbs',
    price: 8.99,
    isCompleted: false,
    priority: 'high',
    notes: 'Free-range preferred',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    name: 'Spinach',
    category: 'Vegetables',
    quantity: 1,
    unit: 'bag',
    price: 2.49,
    isCompleted: false,
    priority: 'low',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
]

export const useShoppingListStore = create<ShoppingListStore>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      isLoading: false,
      error: null,
      filter: 'all',
      searchQuery: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',

      // Actions
      addItem: (itemData) => {
        const newItem: ShoppingItem = {
          ...itemData,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        
        set((state) => ({
          items: [newItem, ...state.items],
          error: null,
        }))
      },

      updateItem: (id, updates) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : item
          ),
          error: null,
        }))
      },

      deleteItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
          error: null,
        }))
      },

      toggleItem: (id) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  isCompleted: !item.isCompleted,
                  completedAt: !item.isCompleted ? new Date().toISOString() : undefined,
                  updatedAt: new Date().toISOString(),
                }
              : item
          ),
          error: null,
        }))
      },

      clearCompleted: () => {
        set((state) => ({
          items: state.items.filter((item) => !item.isCompleted),
          error: null,
        }))
      },

      setFilter: (filter) => {
        set({ filter })
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query })
      },

      setSortBy: (sortBy) => {
        set({ sortBy })
      },

      setSortOrder: (order) => {
        set({ sortOrder: order })
      },

      bulkAddItems: (items) => {
        const newItems: ShoppingItem[] = items.map((itemData) => ({
          ...itemData,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }))
        
        set((state) => ({
          items: [...newItems, ...state.items],
          error: null,
        }))
      },

      duplicateItem: (id) => {
        const { items } = get()
        const itemToDuplicate = items.find((item) => item.id === id)
        
        if (itemToDuplicate) {
          const duplicatedItem: ShoppingItem = {
            ...itemToDuplicate,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: `${itemToDuplicate.name} (Copy)`,
            isCompleted: false,
            completedAt: undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          
          set((state) => ({
            items: [duplicatedItem, ...state.items],
            error: null,
          }))
        }
      },

      clearError: () => {
        set({ error: null })
      },

      initializeList: () => {
        set({ isLoading: true })
        
        try {
          // In a real app, this would fetch from API
          // For demo, we'll use mock data
          const storedItems = localStorage.getItem(STORAGE_KEYS.SHOPPING_LIST)
          
          if (storedItems) {
            const items = JSON.parse(storedItems) as ShoppingItem[]
            set({ items, isLoading: false, error: null })
          } else {
            // Use mock data for first time users
            set({ items: mockItems, isLoading: false, error: null })
          }
        } catch (error) {
          console.error('Failed to initialize shopping list:', error)
          set({
            items: [],
            isLoading: false,
            error: 'Failed to load shopping list',
          })
        }
      },
    }),
    {
      name: 'konzia-shopping-list',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        filter: state.filter,
        searchQuery: state.searchQuery,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
      }),
    }
  )
)

// Computed selectors
export const useShoppingListSelectors = () => {
  const store = useShoppingListStore()
  
  const filteredAndSortedItems = store.items
    .filter((item) => {
      // Apply filter
      if (store.filter === 'active') return !item.isCompleted
      if (store.filter === 'completed') return item.isCompleted
      return true
    })
    .filter((item) => {
      // Apply search
      if (!store.searchQuery) return true
      return item.name.toLowerCase().includes(store.searchQuery.toLowerCase()) ||
             item.category.toLowerCase().includes(store.searchQuery.toLowerCase()) ||
             item.notes?.toLowerCase().includes(store.searchQuery.toLowerCase())
    })
    .sort((a, b) => {
      // Apply sorting
      let aValue: string | number
      let bValue: string | number
      
      switch (store.sortBy) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'category':
          aValue = a.category.toLowerCase()
          bValue = b.category.toLowerCase()
          break
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          aValue = priorityOrder[a.priority]
          bValue = priorityOrder[b.priority]
          break
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
          break
      }
      
      if (store.sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })
  
  const stats = {
    total: store.items.length,
    completed: store.items.filter(item => item.isCompleted).length,
    active: store.items.filter(item => !item.isCompleted).length,
    totalSpent: store.items
      .filter(item => item.isCompleted && item.price)
      .reduce((sum, item) => sum + (item.price || 0), 0),
  }
  
  return {
    ...store,
    filteredAndSortedItems,
    stats,
  }
}
