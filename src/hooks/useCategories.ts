import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export interface Category {
  id: string
  name: string
  icon: string
  count: number
  created_at: string
}

interface UseCategoriesReturn {
  categories: Category[]
  loading: boolean
  error: string | null
}

export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      if (!isSupabaseConfigured()) {
        setLoading(false)
        return
      }

      try {
        // Fetch categories
        const { data: categoriesData, error: catError } = await supabase
          .from('categories')
          .select('*')
          .order('created_at', { ascending: false })

        if (catError) throw catError

        // Fetch blog counts grouped by category_id
        const { data: blogCounts, error: countError } = await supabase
          .from('blogs')
          .select('category_id')
          .not('category_id', 'is', null)

        if (countError) throw countError

        // Count blogs per category
        const countMap: Record<string, number> = {}
        blogCounts?.forEach((blog) => {
          if (blog.category_id) {
            countMap[blog.category_id] = (countMap[blog.category_id] || 0) + 1
          }
        })

        // Merge counts with categories
        const categoriesWithCount = (categoriesData || []).map((cat) => ({
          ...cat,
          count: countMap[cat.id] || 0,
        }))

        // Sort by count descending
        categoriesWithCount.sort((a, b) => b.count - a.count)

        setCategories(categoriesWithCount)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch categories')
        console.error('Error fetching categories:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}
