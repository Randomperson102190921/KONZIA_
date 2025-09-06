// User types
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

// Auth types
export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials {
  name: string
  email: string
  password: string
  confirmPassword: string
}

// Shopping List types
export interface ShoppingItem {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  price?: number
  isCompleted: boolean
  priority: 'low' | 'medium' | 'high'
  notes?: string
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export interface ShoppingListState {
  items: ShoppingItem[]
  isLoading: boolean
  error: string | null
  filter: 'all' | 'active' | 'completed'
  searchQuery: string
  sortBy: 'name' | 'category' | 'priority' | 'createdAt'
  sortOrder: 'asc' | 'desc'
}

// Budget types
export interface BudgetCategory {
  id: string
  name: string
  limit: number
  spent: number
  color: string
}

export interface BudgetState {
  monthlyLimit: number
  spent: number
  remaining: number
  categories: BudgetCategory[]
  isLoading: boolean
  error: string | null
}

// Analytics types
export interface SpendingData {
  date: string
  amount: number
  category: string
}

export interface AnalyticsState {
  spendingData: SpendingData[]
  categoryBreakdown: Array<{
    category: string
    amount: number
    percentage: number
    color: string
  }>
  monthlyTrends: Array<{
    month: string
    spent: number
    budget: number
  }>
  topItems: Array<{
    name: string
    totalSpent: number
    frequency: number
  }>
  isLoading: boolean
  error: string | null
}

// Recipe types
export interface Recipe {
  id: string
  title: string
  description: string
  image: string
  prepTime: number
  cookTime: number
  servings: number
  difficulty: 'easy' | 'medium' | 'hard'
  ingredients: RecipeIngredient[]
  instructions: string[]
  tags: string[]
  rating: number
  createdAt: string
}

export interface RecipeIngredient {
  id: string
  name: string
  amount: number
  unit: string
  notes?: string
}

export interface RecipesState {
  recipes: Recipe[]
  featuredRecipes: Recipe[]
  searchQuery: string
  selectedCategory: string
  selectedDifficulty: string
  isLoading: boolean
  error: string | null
}

// Theme types
export interface ThemeState {
  mode: 'light' | 'dark' | 'system'
  isDark: boolean
}

// Notification types
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form types
export interface FormState<T> {
  data: T
  errors: Partial<Record<keyof T, string>>
  isSubmitting: boolean
  isValid: boolean
}

// Navigation types
export interface NavItem {
  id: string
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
  isActive?: boolean
}

// Chart types
export interface ChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
  }>
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

// Component props types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  onFocus?: () => void
  disabled?: boolean
  required?: boolean
  error?: string
  label?: string
  helperText?: string
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
}

// Error types
export interface AppError {
  code: string
  message: string
  details?: Record<string, unknown>
}

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'konzia_auth_token',
  USER_DATA: 'konzia_user_data',
  THEME_MODE: 'konzia_theme_mode',
  SHOPPING_LIST: 'konzia_shopping_list',
  BUDGET_DATA: 'konzia_budget_data',
  SETTINGS: 'konzia_settings',
} as const

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    PROFILE: '/api/auth/profile',
  },
  SHOPPING_LIST: {
    LIST: '/api/shopping-list',
    ITEM: '/api/shopping-list/item',
  },
  BUDGET: {
    BUDGET: '/api/budget',
    CATEGORIES: '/api/budget/categories',
  },
  ANALYTICS: {
    SPENDING: '/api/analytics/spending',
    CATEGORIES: '/api/analytics/categories',
    TRENDS: '/api/analytics/trends',
  },
  RECIPES: {
    LIST: '/api/recipes',
    FEATURED: '/api/recipes/featured',
    SEARCH: '/api/recipes/search',
  },
} as const
