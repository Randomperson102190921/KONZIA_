import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  UserGroupIcon,
  StarIcon,
  PlusIcon,
  BookOpenIcon,
  HeartIcon,
} from '@heroicons/react/24/outline'
import { useShoppingListStore } from '@/store/useShoppingListStore'
import { useNotificationStore } from '@/store/useNotificationStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { Recipe, RecipeIngredient } from '@/types'
import { cn } from '@/utils/cn'

// Mock recipe data
const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Mediterranean Quinoa Bowl',
    description: 'A healthy and delicious quinoa bowl with fresh vegetables and herbs',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    difficulty: 'easy',
    ingredients: [
      { id: '1', name: 'Quinoa', amount: 1, unit: 'cup', notes: 'rinsed' },
      { id: '2', name: 'Cherry Tomatoes', amount: 1, unit: 'cup', notes: 'halved' },
      { id: '3', name: 'Cucumber', amount: 1, unit: 'piece', notes: 'diced' },
      { id: '4', name: 'Red Onion', amount: 0.5, unit: 'piece', notes: 'thinly sliced' },
      { id: '5', name: 'Feta Cheese', amount: 100, unit: 'g', notes: 'crumbled' },
      { id: '6', name: 'Olive Oil', amount: 3, unit: 'tbsp' },
      { id: '7', name: 'Lemon Juice', amount: 2, unit: 'tbsp' },
      { id: '8', name: 'Fresh Basil', amount: 0.25, unit: 'cup', notes: 'chopped' },
    ],
    instructions: [
      'Cook quinoa according to package instructions and let cool',
      'In a large bowl, combine quinoa, tomatoes, cucumber, and red onion',
      'In a small bowl, whisk together olive oil and lemon juice',
      'Pour dressing over quinoa mixture and toss to combine',
      'Top with feta cheese and fresh basil',
      'Serve immediately or refrigerate for up to 3 days'
    ],
    tags: ['healthy', 'vegetarian', 'gluten-free', 'meal-prep'],
    rating: 4.8,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Creamy Mushroom Pasta',
    description: 'Rich and creamy pasta with sautéed mushrooms and herbs',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop',
    prepTime: 10,
    cookTime: 20,
    servings: 3,
    difficulty: 'medium',
    ingredients: [
      { id: '1', name: 'Pasta', amount: 300, unit: 'g', notes: 'any type' },
      { id: '2', name: 'Mushrooms', amount: 400, unit: 'g', notes: 'sliced' },
      { id: '3', name: 'Heavy Cream', amount: 1, unit: 'cup' },
      { id: '4', name: 'Garlic', amount: 3, unit: 'cloves', notes: 'minced' },
      { id: '5', name: 'Parmesan Cheese', amount: 0.5, unit: 'cup', notes: 'grated' },
      { id: '6', name: 'Butter', amount: 2, unit: 'tbsp' },
      { id: '7', name: 'Fresh Thyme', amount: 2, unit: 'tbsp', notes: 'chopped' },
      { id: '8', name: 'Salt and Pepper', amount: 1, unit: 'tsp', notes: 'to taste' },
    ],
    instructions: [
      'Cook pasta according to package instructions',
      'In a large pan, melt butter over medium heat',
      'Add mushrooms and cook until golden brown',
      'Add garlic and cook for 1 minute',
      'Pour in heavy cream and bring to a simmer',
      'Add cooked pasta and toss to combine',
      'Stir in parmesan cheese and fresh thyme',
      'Season with salt and pepper to taste'
    ],
    tags: ['comfort-food', 'vegetarian', 'quick', 'creamy'],
    rating: 4.6,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Asian Stir-Fry',
    description: 'Quick and flavorful stir-fry with vegetables and protein',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
    prepTime: 20,
    cookTime: 15,
    servings: 4,
    difficulty: 'easy',
    ingredients: [
      { id: '1', name: 'Chicken Breast', amount: 500, unit: 'g', notes: 'sliced' },
      { id: '2', name: 'Broccoli', amount: 2, unit: 'cups', notes: 'florets' },
      { id: '3', name: 'Bell Peppers', amount: 2, unit: 'pieces', notes: 'sliced' },
      { id: '4', name: 'Carrots', amount: 2, unit: 'pieces', notes: 'julienned' },
      { id: '5', name: 'Soy Sauce', amount: 3, unit: 'tbsp' },
      { id: '6', name: 'Sesame Oil', amount: 1, unit: 'tbsp' },
      { id: '7', name: 'Ginger', amount: 1, unit: 'tbsp', notes: 'minced' },
      { id: '8', name: 'Garlic', amount: 2, unit: 'cloves', notes: 'minced' },
    ],
    instructions: [
      'Heat oil in a large wok or pan over high heat',
      'Add chicken and cook until golden brown',
      'Add vegetables and stir-fry for 3-4 minutes',
      'Add ginger and garlic, cook for 1 minute',
      'Pour in soy sauce and toss everything together',
      'Cook for another 2-3 minutes until vegetables are tender-crisp',
      'Serve immediately over rice or noodles'
    ],
    tags: ['asian', 'healthy', 'quick', 'protein'],
    rating: 4.7,
    createdAt: new Date().toISOString(),
  },
]

export const RecipesPage: React.FC = () => {
  const { bulkAddItems } = useShoppingListStore()
  const { showSuccess, showError } = useNotificationStore()
  
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [favorites, setFavorites] = useState<string[]>([])

  const categories = ['all', 'healthy', 'comfort-food', 'vegetarian', 'quick', 'meal-prep', 'asian', 'gluten-free']
  const difficulties = ['all', 'easy', 'medium', 'hard']

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setRecipes(mockRecipes)
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || recipe.tags.includes(selectedCategory)
    const matchesDifficulty = selectedDifficulty === 'all' || recipe.difficulty === selectedDifficulty
    
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const handleAddToShoppingList = (recipe: Recipe) => {
    const items = recipe.ingredients.map(ingredient => ({
      name: ingredient.name,
      category: 'Pantry', // Default category
      quantity: ingredient.amount,
      unit: ingredient.unit,
      priority: 'medium' as const,
      notes: ingredient.notes,
      isCompleted: false,
    }))

    bulkAddItems(items)
    showSuccess('Ingredients Added', `Added ${items.length} ingredients from "${recipe.title}" to your shopping list`)
  }

  const handleToggleFavorite = (recipeId: string) => {
    setFavorites(prev => 
      prev.includes(recipeId) 
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    )
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100 dark:bg-green-900/20'
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
      case 'hard': return 'text-red-600 bg-red-100 dark:bg-red-900/20'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <LoadingSkeleton className="h-8 w-48" />
            <LoadingSkeleton className="h-4 w-64 mt-2" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <LoadingSkeleton className="h-48 w-full rounded-t-lg" />
              <CardContent className="p-6">
                <LoadingSkeleton className="h-6 w-3/4 mb-2" />
                <LoadingSkeleton className="h-4 w-full mb-4" />
                <div className="flex space-x-2">
                  <LoadingSkeleton className="h-6 w-16" />
                  <LoadingSkeleton className="h-6 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Recipes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover delicious recipes and add ingredients to your shopping list
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={setSearchQuery}
                icon={<MagnifyingGlassIcon className="h-4 w-4" />}
              />
            </div>
            
            <div className="flex space-x-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input"
              >
                <option value="all">All Categories</option>
                {categories.slice(1).map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
              
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="input"
              >
                <option value="all">All Levels</option>
                {difficulties.slice(1).map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredRecipes.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="text-center py-12">
                <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                  No recipes found
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Try adjusting your search or filter criteria
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredRecipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="h-48 w-full object-cover rounded-t-lg"
                  />
                  <button
                    onClick={() => handleToggleFavorite(recipe.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                  >
                    <HeartIcon className={cn(
                      'h-5 w-5',
                      favorites.includes(recipe.id) ? 'text-red-500 fill-current' : 'text-gray-400'
                    )} />
                  </button>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                      {recipe.title}
                    </h3>
                    <div className="flex items-center ml-2">
                      <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                        {recipe.rating}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {recipe.description}
                  </p>
                  
                  <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {recipe.prepTime + recipe.cookTime} min
                    </div>
                    <div className="flex items-center">
                      <UserGroupIcon className="h-4 w-4 mr-1" />
                      {recipe.servings} servings
                    </div>
                    <span className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      getDifficultyColor(recipe.difficulty)
                    )}>
                      {recipe.difficulty}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {recipe.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {recipe.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                        +{recipe.tags.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <Button
                    onClick={() => handleAddToShoppingList(recipe)}
                    className="w-full"
                  >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add to Shopping List
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
