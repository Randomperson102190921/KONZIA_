import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Bars3Icon, 
  BellIcon, 
  UserCircleIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline'
import { Menu, Transition } from '@headlessui/react'
import { useAuthStore } from '@/store/useAuthStore'
import { useThemeStore } from '@/store/useThemeStore'
import { useNotificationStore } from '@/store/useNotificationStore'
import { User } from '@/types'
import { cn } from '@/utils/cn'

interface NavbarProps {
  onMenuClick: () => void
  user: User | null
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick, user }) => {
  const { logout } = useAuthStore()
  const { mode, setMode } = useThemeStore()
  const { showInfo } = useNotificationStore()

  const handleLogout = () => {
    logout()
    showInfo('Logged Out', 'You have been successfully logged out')
  }

  const themeOptions = [
    { value: 'light', label: 'Light', icon: SunIcon },
    { value: 'dark', label: 'Dark', icon: MoonIcon },
    { value: 'system', label: 'System', icon: ComputerDesktopIcon },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left side */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              type="button"
              className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 lg:hidden"
              onClick={onMenuClick}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" />
            </button>

            {/* Logo */}
            <Link to="/dashboard" className="ml-4 flex items-center lg:ml-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-700 text-white">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                  />
                </svg>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-gray-100">
                KONZIA
              </span>
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Theme selector */}
            <Menu as="div" className="relative">
              <Menu.Button className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:hover:bg-gray-700">
                <span className="sr-only">Change theme</span>
                {mode === 'light' && <SunIcon className="h-5 w-5" />}
                {mode === 'dark' && <MoonIcon className="h-5 w-5" />}
                {mode === 'system' && <ComputerDesktopIcon className="h-5 w-5" />}
              </Menu.Button>
              
              <Transition
                as={React.Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800">
                  {themeOptions.map((option) => {
                    const Icon = option.icon
                    return (
                      <Menu.Item key={option.value}>
                        {({ active }) => (
                          <button
                            className={cn(
                              'flex w-full items-center px-4 py-2 text-sm',
                              active
                                ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
                                : 'text-gray-700 dark:text-gray-300',
                              mode === option.value && 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                            )}
                            onClick={() => setMode(option.value as any)}
                          >
                            <Icon className="mr-3 h-4 w-4" />
                            {option.label}
                          </button>
                        )}
                      </Menu.Item>
                    )
                  })}
                </Menu.Items>
              </Transition>
            </Menu>

            {/* Notifications */}
            <button
              type="button"
              className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:hover:bg-gray-700"
              onClick={() => showInfo('Notifications', 'No new notifications')}
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-5 w-5" />
            </button>

            {/* User menu */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <span className="sr-only">Open user menu</span>
                {user?.avatar ? (
                  <img
                    className="h-8 w-8 rounded-full"
                    src={user.avatar}
                    alt={user.name}
                  />
                ) : (
                  <UserCircleIcon className="h-8 w-8 text-gray-400" />
                )}
              </Menu.Button>
              
              <Transition
                as={React.Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800">
                  <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                    <div className="font-medium">{user?.name}</div>
                    <div className="text-gray-500 dark:text-gray-400">{user?.email}</div>
                  </div>
                  
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/settings"
                        className={cn(
                          'block px-4 py-2 text-sm',
                          active
                            ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
                            : 'text-gray-700 dark:text-gray-300'
                        )}
                      >
                        Settings
                      </Link>
                    )}
                  </Menu.Item>
                  
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={cn(
                          'block w-full px-4 py-2 text-left text-sm',
                          active
                            ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
                            : 'text-gray-700 dark:text-gray-300'
                        )}
                        onClick={handleLogout}
                      >
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  )
}
