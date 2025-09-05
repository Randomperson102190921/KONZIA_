import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { BudgetState, BudgetCategory } from '@/types'
import { STORAGE_KEYS } from '@/types'

interface BudgetActions {
  setMonthlyLimit: (limit: number) => void
  addCategory: (category: Omit<BudgetCategory, 'id'>) => void
  updateCategory: (id: string, updates: Partial<BudgetCategory>) => void
  deleteCategory: (id: string) => void
  updateSpent: (categoryId: string, amount: number) => void
  resetBudget: () => void
  clearError: () => void
  initializeBudget: () => void
}

type BudgetStore = BudgetState & BudgetActions

// Mock data for demo
const mockCategories: BudgetCategory[] = [
  {
    id: '1',
    name: 'Groceries',
    limit: 400,
    spent: 320,
    color: '#006400',
  },
  {
    id: '2',
    name: 'Dining Out',
    limit: 150,
    spent: 89,
    color: '#228B22',
  },
  {
    id: '3',
    name: 'Snacks',
    limit: 50,
    spent: 23,
    color: '#32CD32',
  },
  {
    id: '4',
    name: 'Beverages',
    limit: 75,
    spent: 45,
    color: '#90EE90',
  },
]

const defaultMonthlyLimit = 675

export const useBudgetStore = create<BudgetStore>()(
  persist(
    (set, get) => ({
      // Initial state
      monthlyLimit: defaultMonthlyLimit,
      spent: 0,
      remaining: 0,
      categories: [],
      isLoading: false,
      error: null,

      // Actions
      setMonthlyLimit: (limit) => {
        set((state) => {
          const newSpent = state.categories.reduce((sum, cat) => sum + cat.spent, 0)
          return {
            monthlyLimit: limit,
            remaining: limit - newSpent,
            error: null,
          }
        })
      },

      addCategory: (categoryData) => {
        const newCategory: BudgetCategory = {
          ...categoryData,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        }
        
        set((state) => {
          const newSpent = [...state.categories, newCategory].reduce((sum, cat) => sum + cat.spent, 0)
          return {
            categories: [...state.categories, newCategory],
            spent: newSpent,
            remaining: state.monthlyLimit - newSpent,
            error: null,
          }
        })
      },

      updateCategory: (id, updates) => {
        set((state) => {
          const updatedCategories = state.categories.map((category) =>
            category.id === id ? { ...category, ...updates } : category
          )
          const newSpent = updatedCategories.reduce((sum, cat) => sum + cat.spent, 0)
          
          return {
            categories: updatedCategories,
            spent: newSpent,
            remaining: state.monthlyLimit - newSpent,
            error: null,
          }
        })
      },

      deleteCategory: (id) => {
        set((state) => {
          const updatedCategories = state.categories.filter((category) => category.id !== id)
          const newSpent = updatedCategories.reduce((sum, cat) => sum + cat.spent, 0)
          
          return {
            categories: updatedCategories,
            spent: newSpent,
            remaining: state.monthlyLimit - newSpent,
            error: null,
          }
        })
      },

      updateSpent: (categoryId, amount) => {
        set((state) => {
          const updatedCategories = state.categories.map((category) =>
            category.id === categoryId
              ? { ...category, spent: Math.max(0, amount) }
              : category
          )
          const newSpent = updatedCategories.reduce((sum, cat) => sum + cat.spent, 0)
          
          return {
            categories: updatedCategories,
            spent: newSpent,
            remaining: state.monthlyLimit - newSpent,
            error: null,
          }
        })
      },

      resetBudget: () => {
        set((state) => ({
          categories: state.categories.map((category) => ({
            ...category,
            spent: 0,
          })),
          spent: 0,
          remaining: state.monthlyLimit,
          error: null,
        }))
      },

      clearError: () => {
        set({ error: null })
      },

      initializeBudget: () => {
        set({ isLoading: true })
        
        try {
          const storedBudget = localStorage.getItem(STORAGE_KEYS.BUDGET_DATA)
          
          if (storedBudget) {
            const budgetData = JSON.parse(storedBudget) as BudgetState
            set({
              ...budgetData,
              isLoading: false,
              error: null,
            })
          } else {
            // Use mock data for first time users
            const mockSpent = mockCategories.reduce((sum, cat) => sum + cat.spent, 0)
            set({
              monthlyLimit: defaultMonthlyLimit,
              spent: mockSpent,
              remaining: defaultMonthlyLimit - mockSpent,
              categories: mockCategories,
              isLoading: false,
              error: null,
            })
          }
        } catch (error) {
          console.error('Failed to initialize budget:', error)
          set({
            monthlyLimit: defaultMonthlyLimit,
            spent: 0,
            remaining: defaultMonthlyLimit,
            categories: [],
            isLoading: false,
            error: 'Failed to load budget data',
          })
        }
      },
    }),
    {
      name: 'konzia-budget',
      partialize: (state) => ({
        monthlyLimit: state.monthlyLimit,
        spent: state.spent,
        remaining: state.remaining,
        categories: state.categories,
      }),
    }
  )
)

// Computed selectors
export const useBudgetSelectors = () => {
  const store = useBudgetStore()
  
  const budgetProgress = store.monthlyLimit > 0 
    ? Math.min((store.spent / store.monthlyLimit) * 100, 100)
    : 0
  
  const isOverBudget = store.spent > store.monthlyLimit
  
  const categoryBreakdown = store.categories.map((category) => ({
    ...category,
    percentage: store.monthlyLimit > 0 
      ? (category.spent / store.monthlyLimit) * 100 
      : 0,
    remaining: category.limit - category.spent,
    isOverLimit: category.spent > category.limit,
  }))
  
  const totalSpent = store.categories.reduce((sum, cat) => sum + cat.spent, 0)
  const totalLimit = store.categories.reduce((sum, cat) => sum + cat.limit, 0)
  
  return {
    ...store,
    budgetProgress,
    isOverBudget,
    categoryBreakdown,
    totalSpent,
    totalLimit,
  }
}
