import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useBlogLikes(blogId: string) {
  const [likes, setLikes] = useState(0)
  const [hasLiked, setHasLiked] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!blogId) return

    // Get visitor ID
    let visitorId = localStorage.getItem('visitor_id')
    if (!visitorId) {
      visitorId = Math.random().toString(36).substring(2) + Date.now().toString(36)
      localStorage.setItem('visitor_id', visitorId)
    }

    // Fetch total likes count
    supabase
      .from('blog_likes')
      .select('*', { count: 'exact' })
      .eq('blog_id', blogId)
      .then(({ count }) => {
        setLikes(count || 0)
      })

    // Check if current visitor has liked
    supabase
      .from('blog_likes')
      .select('id')
      .eq('blog_id', blogId)
      .eq('visitor_id', visitorId)
      .single()
      .then(({ data }) => {
        setHasLiked(!!data)
        setLoading(false)
      })
  }, [blogId])

  const like = async () => {
    if (!blogId || hasLiked) return

    let visitorId = localStorage.getItem('visitor_id') || ''
    if (!visitorId) return

    await supabase.from('blog_likes').insert({ blog_id: blogId, visitor_id: visitorId })
    setLikes((prev) => prev + 1)
    setHasLiked(true)
  }

  const unlike = async () => {
    if (!blogId || !hasLiked) return

    let visitorId = localStorage.getItem('visitor_id') || ''
    if (!visitorId) return

    await supabase
      .from('blog_likes')
      .delete()
      .eq('blog_id', blogId)
      .eq('visitor_id', visitorId)
    setLikes((prev) => Math.max(0, prev - 1))
    setHasLiked(false)
  }

  const toggleLike = async () => {
    if (hasLiked) {
      await unlike()
    } else {
      await like()
    }
  }

  return { likes, hasLiked, loading, toggleLike }
}
