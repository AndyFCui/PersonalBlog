import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Tag, ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useBlogs } from '@/hooks/useBlogs'
import { BlogHeader } from '@/components/blog-header'

export function BlogTagsPage() {
  const { blogs, loading } = useBlogs()

  // Extract all tags and count them
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    blogs.forEach((blog) => {
      if (blog.tags && Array.isArray(blog.tags)) {
        blog.tags.forEach((tag) => {
          counts[tag] = (counts[tag] || 0) + 1
        })
      }
    })
    // Sort by count descending
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([tag, count]) => ({ tag, count }))
  }, [blogs])

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

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Tag className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold dark:text-white">Tags</h1>
          </div>
          <p className="text-muted-foreground">
            Browse all tags used in articles. Each tag shows how many articles are associated with it.
          </p>
        </motion.div>

        {/* Tags Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tagCounts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4 opacity-30">🏷️</p>
            <p className="text-xl font-medium mb-2">No tags yet</p>
            <p className="text-muted-foreground">Articles will be tagged when published.</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {tagCounts.map(({ tag, count }, index) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/blog?tag=${encodeURIComponent(tag)}`}>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-card hover:bg-secondary transition-all group border border-border/50">
                    <div className="flex-1 min-w-0">
                      <Badge variant="outline" className="text-xs border-primary/30 text-primary mb-2">
                        {tag}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {count} {count === 1 ? 'article' : 'articles'}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Stats */}
        {!loading && tagCounts.length > 0 && (
          <div className="mt-12 text-center text-sm text-muted-foreground">
            Total {tagCounts.length} tags across {blogs.length} articles
          </div>
        )}
      </main>
    </div>
  )
}
