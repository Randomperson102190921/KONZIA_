import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { useThemeStore } from '@/store/useThemeStore'
import { Layout } from '@/components/layout/Layout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { LoadingScreen } from '@/components/ui/LoadingScreen'

// Pages
import { LoginPage } from '@/pages/auth/LoginPage'
import { SignupPage } from '@/pages/auth/SignupPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ShoppingListPage } from '@/pages/ShoppingListPage'
import { BudgetPage } from '@/pages/BudgetPage'
import { AnalyticsPage } from '@/pages/AnalyticsPage'
import { RecipesPage } from '@/pages/RecipesPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

// PWA registration
import { registerSW } from 'workbox-window'

function App() {
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore()
  const { initializeTheme } = useThemeStore()

  useEffect(() => {
    // Initialize authentication and theme
    initializeAuth()
    initializeTheme()

    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      registerSW('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
        })
    }
  }, [initializeAuth, initializeTheme])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignupPage />
          }
        />

        {/* Protected routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/shopping-list" element={<ShoppingListPage />} />
                  <Route path="/budget" element={<BudgetPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/recipes" element={<RecipesPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}

export default App
