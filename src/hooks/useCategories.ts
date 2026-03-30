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
        const { data, error: supabaseError } = await supabase
          .from('categories')
          .select('*')
          .order('count', { ascending: false })

        if (supabaseError) throw supabaseError
        setCategories(data || [])
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
