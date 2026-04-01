import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Viewer } from '@bytemd/react'
import gfm from '@bytemd/plugin-gfm'
import mermaid from '@bytemd/plugin-mermaid'
import rehypeSlug from 'rehype-slug'
import rehypeAutolink from 'rehype-autolink-headings'
import 'bytemd/dist/index.css'
import { ArrowLeft, Calendar, User, Eye, MessageCircle, ThumbsUp, MapPin, Clock, ChevronLeft, ChevronRight, Heart, ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useAuthor } from '@/hooks/useAuthor'
import { BlogHeader } from '@/components/blog-header'
import { useComments, type Comment } from '@/hooks/useComments'
import type { Blog } from '@/hooks/useBlogs'
import { supabase } from '@/lib/supabase'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Icons8Coffee } from '@/components/icons8-coffee'
import { ArticleToc } from '@/components/article-toc'

const plugins = [gfm(), mermaid()]
const rehypePlugins = [rehypeSlug, rehypeAutolink]

function CommentCard({ comment, visitorId, onLike, onUnlike }: {
  comment: Comment
  visitorId: string
  onLike: () => void
  onUnlike: () => void
}) {
  const hasLiked = comment.id === visitorId // simplified for demo

  const formatTime = (date: string) => {
    const d = new Date(date)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl p-4 border border-border/50"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-medium">
          {comment.author_name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-foreground">{comment.author_name}</span>
            {comment.author_region && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                {comment.author_region}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {formatTime(comment.created_at)}
            </span>
          </div>
          <p className="text-sm text-foreground/90 whitespace-pre-wrap break-words">{comment.content}</p>
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={comment.likes > 0 ? onUnlike : onLike}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <ThumbsUp className={`w-4 h-4 ${comment.likes > 0 ? 'fill-primary text-primary' : ''}`} />
              <span>{comment.likes}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [region, setRegion] = useState<string>('')
  const [commentName, setCommentName] = useState('')
  const [commentContent, setCommentContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { author } = useAuthor()
  const [showTipModal, setShowTipModal] = useState(false)
  const [showToc, setShowToc] = useState(true)

  const visitorId = (() => {
    let id = localStorage.getItem('visitor_id')
    if (!id) {
      id = Math.random().toString(36).substring(2) + Date.now().toString(36)
      localStorage.setItem('visitor_id', id)
    }
    return id
  })()

  const { comments, loading: commentsLoading, addComment, likeComment, unlikeComment } = useComments(blog?.id || '')

  // Fetch blog
  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) return

      try {
        const { data, error: fetchError } = await supabase
          .from('blogs')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .single()

        if (fetchError) throw fetchError
        setBlog(data)

        // Increment view count
        if (data?.id) {
          await supabase
            .from('blogs')
            .update({ views: (data.views || 0) + 1 })
            .eq('id', data.id)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Blog not found')
      } finally {
        setLoading(false)
      }
    }

    fetchBlog()
  }, [slug])

  // Fetch region from geojs
  useEffect(() => {
    fetch('https://get.geojs.io/v1/ip/geo.json')
      .then(res => res.json())
      .then(data => {
        if (data.city && data.country) {
          setRegion(`${data.city}, ${data.country}`)
        }
      })
      .catch(() => {})
  }, [])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentName.trim() || !commentContent.trim() || !blog?.id) return

    setSubmitting(true)
    try {
      await addComment(commentName, commentContent, region)
      setCommentContent('')
    } catch (err) {
      console.error('Failed to add comment:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleLike = async (commentId: string) => {
    await likeComment(commentId, visitorId)
  }

  const handleUnlike = async (commentId: string) => {
    await unlikeComment(commentId, visitorId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Article Not Found</h1>
          <p className="text-muted-foreground mb-4">The article you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/blog">Back to Blog</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />

      <main className="max-w-4xl mx-auto px-4 pt-24 pb-12">
        {/* Back Link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Article Header */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex gap-2 mb-4">
              {blog.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs border-primary/30 text-primary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{blog.title}</h1>

          {/* Meta Info */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {author?.name || 'Admin'}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {blog.published_at
                ? new Date(blog.published_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Recently'}
            </span>
            {blog.updated_at && blog.updated_at !== blog.published_at && (
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Last updated: {new Date(blog.updated_at).toLocaleString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {(blog.views || 0).toLocaleString()} Views
            </span>
            {(author?.wechat_qr || author?.alipay_qr || author?.venmo_qr) && (
              <button
                onClick={() => {
                  document.getElementById('support-author')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
              >
                <Heart className="w-4 h-4" />
                打赏博主
              </button>
            )}
          </div>

          {/* Content with TOC Sidebar */}
          <div className="flex gap-8">
            {/* TOC Sidebar - Left */}
            {showToc && (
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-24">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-muted-foreground">Contents</span>
                    <button
                      onClick={() => setShowToc(false)}
                      className="p-1 hover:bg-secondary rounded transition-colors"
                      title="点击关闭目录"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                  <ArticleToc content={blog.content} />
                </div>
              </aside>
            )}

            {/* Toggle TOC Button (when hidden) */}
            {!showToc && (
              <button
                onClick={() => setShowToc(true)}
                className="hidden lg:flex fixed left-0 top-1/2 -translate-y-1/2 bg-card border border-border rounded-r-lg p-2 shadow-md hover:bg-secondary transition-colors z-10"
                title="点击展开目录"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {/* Main Content */}
            <div className={`flex-1 min-w-0 bytemd-viewer-container ${!showToc ? 'lg:ml-12' : ''}`}>
              <Viewer value={blog.content} plugins={plugins} rehypePlugins={rehypePlugins} />
            </div>
          </div>

          {/* Tip / Support Section */}
          {(author?.wechat_qr || author?.alipay_qr || author?.venmo_qr) && (
            <div id="support-author" className="mt-12 py-8 border-t border-border">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2 dark:text-white">Support the Author</h3>
                <p className="text-muted-foreground text-sm dark:text-white/70">If this article helped you, consider buying me a coffee ☕</p>
                <p className="text-muted-foreground text-xs mt-1 dark:text-white/50">如果这篇文章对您有帮助，可以打赏博主</p>
              </div>
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => setShowTipModal(true)}
                  className="gap-2 dark:text-white"
                >
                  <Icons8Coffee size={20} />
                  Buy me a coffee
                </Button>
              </div>
              <p className="text-center text-xs text-muted-foreground mt-2">点击 Buy me a coffee 查看打赏方式</p>
            </div>
          )}
        </motion.article>

        {/* Comments Section */}
        <section className="mt-16 pt-8 border-t border-border">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mx-auto"
          >
            <ArrowUp className="w-4 h-4" />
            回到顶部
          </button>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 dark:text-white">
            <MessageCircle className="w-6 h-6 dark:text-white" />
            Comments ({comments.length})
          </h2>

          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="mb-8 bg-card rounded-2xl p-6 border border-border/50">
            <h3 className="font-medium mb-4">Leave a comment</h3>
            <div className="space-y-4">
              <Input
                placeholder="Your name"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                required
                className="bg-background/50"
              />
              <textarea
                placeholder="Your comment..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                required
                className="w-full min-h-[100px] px-4 py-3 rounded-xl border border-input bg-secondary text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
              {region && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Commenting from {region}
                </p>
              )}
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          </form>

          {/* Comments List */}
          {commentsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  visitorId={visitorId}
                  onLike={() => handleLike(comment.id)}
                  onUnlike={() => handleUnlike(comment.id)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Tip Modal */}
      <Dialog open={showTipModal} onOpenChange={setShowTipModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Support the Author ☕</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 py-4">
            {author?.wechat_qr && (
              <div className="text-center">
                <p className="text-sm font-medium mb-2">WeChat</p>
                <img
                  src={author.wechat_qr}
                  alt="WeChat Pay"
                  className="w-full rounded-xl"
                />
              </div>
            )}
            {author?.alipay_qr && (
              <div className="text-center">
                <p className="text-sm font-medium mb-2">Alipay</p>
                <img
                  src={author.alipay_qr}
                  alt="Alipay"
                  className="w-full rounded-xl"
                />
              </div>
            )}
            {author?.venmo_qr && (
              <div className="text-center">
                <p className="text-sm font-medium mb-2">Venmo</p>
                <img
                  src={author.venmo_qr}
                  alt="Venmo"
                  className="w-full rounded-xl"
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
