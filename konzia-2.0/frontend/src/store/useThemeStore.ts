import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ThemeState } from '@/types'
import { STORAGE_KEYS } from '@/types'

interface ThemeActions {
  setMode: (mode: ThemeState['mode']) => void
  toggleMode: () => void
  initializeTheme: () => void
}

type ThemeStore = ThemeState & ThemeActions

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      // Initial state
      mode: 'system',
      isDark: false,

      // Actions
      setMode: (mode) => {
        const isDark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
        
        set({ mode, isDark })
        
        // Apply theme to document
        if (isDark) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      },

      toggleMode: () => {
        const { mode } = get()
        const newMode = mode === 'light' ? 'dark' : 'light'
        get().setMode(newMode)
      },

      initializeTheme: () => {
        const { mode } = get()
        get().setMode(mode)
      },
    }),
    {
      name: 'konzia-theme',
      partialize: (state) => ({
        mode: state.mode,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Apply theme after rehydration
          const isDark = state.mode === 'dark' || (state.mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
          state.isDark = isDark
          
          if (isDark) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
        }
      },
    }
  )
)
