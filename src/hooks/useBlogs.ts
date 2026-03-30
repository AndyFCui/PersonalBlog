import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  cover_image: string | null
  tags: string[]
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

interface UseBlogsReturn {
  blogs: Blog[]
  loading: boolean
  error: string | null
}

export function useBlogs(): UseBlogsReturn {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      // Fallback to local JSON if Supabase not configured
      if (!isSupabaseConfigured()) {
        try {
          const response = await fetch('/blogs.json')
          if (response.ok) {
            const data = await response.json()
            setBlogs(data)
          }
        } catch {
          // Ignore fallback errors
        }
        setLoading(false)
        return
      }

      try {
        const { data, error: supabaseError } = await supabase
          .from('blogs')
          .select('*')
          .eq('published', true)
          .order('published_at', { ascending: false })

        if (supabaseError) throw supabaseError
        setBlogs(data || [])
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch blogs')
        console.error('Error fetching blogs:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  return { blogs, loading, error }
}
