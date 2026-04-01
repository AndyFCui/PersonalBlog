/**
 * [INPUT]: 依赖 @/lib/supabase 的 supabase 实例
 * [OUTPUT]: 导出 useComments hook 和 Comment 类型
 * [POS]: src/hooks/ 的评论管理模块
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface Comment {
  id: string
  blog_id: string
  author_name: string
  author_region: string | null
  content: string
  likes: number
  created_at: string
  updated_at: string
}

interface UseCommentsReturn {
  comments: Comment[]
  loading: boolean
  error: string | null
  addComment: (authorName: string, content: string, region?: string) => Promise<void>
  likeComment: (commentId: string, visitorId: string) => Promise<void>
  unlikeComment: (commentId: string, visitorId: string) => Promise<void>
  hasLiked: (commentId: string, visitorId: string) => boolean
  refresh: () => void
}

export function useComments(blogId: string): UseCommentsReturn {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set())

  const fetchComments = async () => {
    if (!blogId) return

    try {
      const { data, error: fetchError } = await supabase
        .from('comments')
        .select('*')
        .eq('blog_id', blogId)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setComments(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch comments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [blogId])

  // Load user's liked comments from localStorage
  useEffect(() => {
    const visitorId = localStorage.getItem('visitor_id') || ''
    if (visitorId) {
      supabase
        .from('comment_likes')
        .select('comment_id')
        .eq('visitor_id', visitorId)
        .then(({ data }) => {
          if (data) {
            setLikedComments(new Set(data.map(d => d.comment_id)))
          }
        })
    }
  }, [])

  const addComment = async (authorName: string, content: string, region?: string) => {
    if (!blogId || !authorName.trim() || !content.trim()) return

    const { error: insertError } = await supabase
      .from('comments')
      .insert({
        blog_id: blogId,
        author_name: authorName.trim(),
        author_region: region || null,
        content: content.trim(),
      })

    if (insertError) throw insertError
    fetchComments()
  }

  const likeComment = async (commentId: string, visitorId: string) => {
    if (likedComments.has(commentId)) return

    await supabase
      .from('comment_likes')
      .insert({
        comment_id: commentId,
        visitor_id: visitorId,
      })

    await supabase
      .from('comments')
      .update({ likes: (comments.find(c => c.id === commentId)?.likes || 0) + 1 })
      .eq('id', commentId)

    setLikedComments(prev => new Set([...prev, commentId]))
    fetchComments()
  }

  const unlikeComment = async (commentId: string, visitorId: string) => {
    if (!likedComments.has(commentId)) return

    await supabase
      .from('comment_likes')
      .delete()
      .eq('comment_id', commentId)
      .eq('visitor_id', visitorId)

    await supabase
      .from('comments')
      .update({ likes: Math.max(0, (comments.find(c => c.id === commentId)?.likes || 0) - 1) })
      .eq('id', commentId)

    setLikedComments(prev => {
      const next = new Set(prev)
      next.delete(commentId)
      return next
    })
    fetchComments()
  }

  const hasLiked = (commentId: string, visitorId: string) => {
    return likedComments.has(commentId)
  }

  return {
    comments,
    loading,
    error,
    addComment,
    likeComment,
    unlikeComment,
    hasLiked,
    refresh: fetchComments,
  }
}
