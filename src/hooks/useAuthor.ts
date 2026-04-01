import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export interface Author {
  id: string
  name: string
  avatar_url: string | null
  bio: string | null
  github: string | null
  email: string | null
  bilibili: string | null
  wechat: string | null
  wechat_qr: string | null
  alipay_qr: string | null
  venmo_qr: string | null
  created_at: string
}

interface UseAuthorReturn {
  author: Author | null
  loading: boolean
  error: string | null
}

export function useAuthor(): UseAuthorReturn {
  const [author, setAuthor] = useState<Author | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAuthor = async () => {
      if (!isSupabaseConfigured()) {
        setLoading(false)
        return
      }

      try {
        const { data, error: supabaseError } = await supabase
          .from('authors')
          .select('*')
          .limit(1)
          .single()

        if (supabaseError) throw supabaseError
        setAuthor(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch author')
        console.error('Error fetching author:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAuthor()
  }, [])

  return { author, loading, error }
}
