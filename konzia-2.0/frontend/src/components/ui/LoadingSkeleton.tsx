import React from 'react'
import { cn } from '@/utils/cn'

interface LoadingSkeletonProps {
  className?: string
  lines?: number
  height?: string
  width?: string
  rounded?: boolean
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className,
  lines = 1,
  height = 'h-4',
  width = 'w-full',
  rounded = true,
}) => {
  if (lines === 1) {
    return (
      <div
        className={cn(
          'skeleton',
          height,
          width,
          rounded && 'rounded',
          className
        )}
      />
    )
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'skeleton',
            height,
            width,
            rounded && 'rounded',
            index === lines - 1 && 'w-3/4', // Last line is shorter
            className
          )}
        />
      ))}
    </div>
  )
}

interface CardSkeletonProps {
  className?: string
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({ className }) => (
  <div className={cn('card', className)}>
    <div className="mb-4 flex items-center space-x-3">
      <div className="h-10 w-10 rounded-full skeleton" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/2 skeleton" />
        <div className="h-3 w-1/3 skeleton" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-4 w-full skeleton" />
      <div className="h-4 w-3/4 skeleton" />
      <div className="h-4 w-1/2 skeleton" />
    </div>
  </div>
)

interface ListSkeletonProps {
  items?: number
  className?: string
}

export const ListSkeleton: React.FC<ListSkeletonProps> = ({ 
  items = 5, 
  className 
}) => (
  <div className={cn('space-y-3', className)}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center space-x-3 p-3">
        <div className="h-5 w-5 rounded skeleton" />
        <div className="flex-1 space-y-1">
          <div className="h-4 w-3/4 skeleton" />
          <div className="h-3 w-1/2 skeleton" />
        </div>
        <div className="h-6 w-16 skeleton" />
      </div>
    ))}
  </div>
)

interface TableSkeletonProps {
  rows?: number
  columns?: number
  className?: string
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ 
  rows = 5, 
  columns = 4,
  className 
}) => (
  <div className={cn('space-y-3', className)}>
    {/* Header */}
    <div className="flex space-x-4">
      {Array.from({ length: columns }).map((_, index) => (
        <div key={index} className="h-4 flex-1 skeleton" />
      ))}
    </div>
    
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <div key={colIndex} className="h-4 flex-1 skeleton" />
        ))}
      </div>
    ))}
  </div>
)
