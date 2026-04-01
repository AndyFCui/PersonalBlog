import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useBlogShares(blogId: string) {
  const [shares, setShares] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!blogId) return

    // Get visitor ID
    let visitorId = localStorage.getItem('visitor_id')
    if (!visitorId) {
      visitorId = Math.random().toString(36).substring(2) + Date.now().toString(36)
      localStorage.setItem('visitor_id', visitorId)
    }

    // Fetch total shares count
    supabase
      .from('blog_shares')
      .select('*', { count: 'exact' })
      .eq('blog_id', blogId)
      .then(({ count }) => {
        setShares(count || 0)
        setLoading(false)
      })
  }, [blogId])

  const share = async () => {
    if (!blogId) return

    let visitorId = localStorage.getItem('visitor_id') || ''
    if (!visitorId) {
      visitorId = Math.random().toString(36).substring(2) + Date.now().toString(36)
      localStorage.setItem('visitor_id', visitorId)
    }

    await supabase.from('blog_shares').insert({ blog_id: blogId, visitor_id: visitorId })
    setShares((prev) => prev + 1)
  }

  return { shares, loading, share }
}
