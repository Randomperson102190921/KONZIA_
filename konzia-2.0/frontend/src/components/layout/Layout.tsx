import React, { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { useThemeStore } from '@/store/useThemeStore'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { Toast } from '@/components/ui/Toast'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const location = useLocation()
  const { user } = useAuthStore()
  const { isDark } = useThemeStore()

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false)
  }, [location])

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    if (!isMobile || !isSidebarOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('[data-sidebar]')) {
        setIsSidebarOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMobile, isSidebarOpen])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <Navbar 
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        user={user}
      />

      {/* Sidebar Overlay for Mobile */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isMobile={isMobile}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${
        isMobile 
          ? 'pt-16 pb-20' 
          : 'pt-16 lg:pl-64'
      }`}>
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children || <Outlet />}
        </main>
      </div>

      {/* Bottom Navigation for Mobile */}
      {isMobile && <BottomNav />}

      {/* Toast Notifications */}
      <Toast />
    </div>
  )
}
