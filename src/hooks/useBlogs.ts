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
  views?: number
}

interface UseBlogsReturn {
  blogs: Blog[]
  loading: boolean
  error: string | null
  refresh: () => void
}

export function useBlogs(publishedOnly = true): UseBlogsReturn {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBlogs = async () => {
    setLoading(true)
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
      let query = supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false })

      if (publishedOnly) {
        query = query.eq('published', true)
      }

      const { data, error: supabaseError } = await query

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

  useEffect(() => {
    fetchBlogs()
  }, [publishedOnly])

  return { blogs, loading, error, refresh: fetchBlogs }
}
