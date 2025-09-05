import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthState, User, LoginCredentials, SignupCredentials } from '@/types'
import { STORAGE_KEYS } from '@/types'

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>
  signup: (credentials: SignupCredentials) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
  updateProfile: (user: Partial<User>) => void
  clearError: () => void
  initializeAuth: () => void
}

type AuthStore = AuthState & AuthActions

// Mock API functions
const mockApi = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock validation
    if (credentials.email === 'demo@konzia.com' && credentials.password === 'demo123') {
      return {
        user: {
          id: '1',
          email: credentials.email,
          name: 'Demo User',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        token: 'mock-jwt-token-' + Date.now()
      }
    }
    
    throw new Error('Invalid credentials')
  },
  
  signup: async (credentials: SignupCredentials): Promise<{ user: User; token: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock validation
    if (credentials.password !== credentials.confirmPassword) {
      throw new Error('Passwords do not match')
    }
    
    if (credentials.password.length < 6) {
      throw new Error('Password must be at least 6 characters')
    }
    
    return {
      user: {
        id: Date.now().toString(),
        email: credentials.email,
        name: credentials.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      token: 'mock-jwt-token-' + Date.now()
    }
  },
  
  refreshToken: async (): Promise<{ token: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return { token: 'mock-refreshed-token-' + Date.now() }
  }
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null })
        
        try {
          const { user, token } = await mockApi.login(credentials)
          
          // Store token in localStorage (in real app, this would be httpOnly cookie)
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
          localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user))
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login failed',
          })
        }
      },

      signup: async (credentials: SignupCredentials) => {
        set({ isLoading: true, error: null })
        
        try {
          const { user, token } = await mockApi.signup(credentials)
          
          // Store token in localStorage
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
          localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user))
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Signup failed',
          })
        }
      },

      logout: () => {
        // Clear stored data
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER_DATA)
        
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        })
      },

      refreshToken: async () => {
        const { isAuthenticated } = get()
        
        if (!isAuthenticated) return
        
        try {
          const { token } = await mockApi.refreshToken()
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
        } catch (error) {
          console.error('Token refresh failed:', error)
          // In a real app, you might want to logout the user here
        }
      },

      updateProfile: (userData: Partial<User>) => {
        const { user } = get()
        if (user) {
          const updatedUser = { ...user, ...userData }
          localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser))
          set({ user: updatedUser })
        }
      },

      clearError: () => {
        set({ error: null })
      },

      initializeAuth: () => {
        set({ isLoading: true })
        
        try {
          const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
          const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA)
          
          if (token && userData) {
            const user = JSON.parse(userData) as User
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            })
          }
        } catch (error) {
          console.error('Auth initialization failed:', error)
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          })
        }
      },
    }),
    {
      name: 'konzia-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
