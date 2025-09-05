import React from 'react'
import { ButtonProps } from '@/types'
import { cn } from '@/utils/cn'

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    disabled = false, 
    loading = false,
    children, 
    onClick,
    type = 'button',
    ...props 
  }, ref) => {
    const baseClasses = 'btn'
    const variantClasses = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      outline: 'btn-outline',
      ghost: 'btn-ghost',
    }
    const sizeClasses = {
      sm: 'btn-sm',
      md: 'btn-md',
      lg: 'btn-lg',
    }

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          loading && 'opacity-50 cursor-not-allowed',
          className
        )}
        disabled={disabled || loading}
        onClick={onClick}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
