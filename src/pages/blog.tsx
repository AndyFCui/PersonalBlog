import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Eye, Calendar, User, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useBlogs, type Blog } from '@/hooks/useBlogs'
import { useCategories } from '@/hooks/useCategories'
import { AuthorSidebar } from '@/pages/blog-author-card'
import { BlogHeader } from '@/components/blog-header'

function BlogCard({ blog }: { blog: Blog }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
    >
      {/* Cover Image */}
      <div className="md:w-[40%] relative overflow-hidden">
        {blog.cover_image ? (
          <img
            src={blog.cover_image}
            alt={blog.title}
            className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-48 md:h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <span className="text-6xl opacity-30">📄</span>
          </div>
        )}
        {/* Category Tag on Image */}
        {blog.tags && blog.tags[0] && (
          <Badge className="absolute top-4 left-4 bg-primary/90 text-white backdrop-blur-sm">
            {blog.tags[0].toUpperCase()}
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col">
        <div className="flex-1">
          {/* Category above title */}
          <div className="mb-3">
            <Badge variant="outline" className="text-xs border-primary/30 text-primary">
              {blog.tags?.[0] || 'Article'}
            </Badge>
          </div>

          {/* Title */}
          <h2 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {blog.title}
          </h2>

          {/* Excerpt */}
          <p className="text-muted-foreground mb-4 line-clamp-2">
            {blog.excerpt || 'No description available for this article.'}
          </p>
        </div>

        {/* Meta Info */}
        <div className="flex items-center justify-between pt-4 border-t border-border/30">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              By Admin
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {Math.floor(Math.random() * 5000 + 1000).toLocaleString()} Views
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {blog.published_at
                ? new Date(blog.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : 'Recently'}
            </span>
          </div>

          {/* Read More Button */}
          <Button size="icon" variant="ghost" className="rounded-full bg-primary/10 hover:bg-primary/20 text-primary">
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.article>
  )
}

function CategoryCard({ category }: { category: typeof categories[0] }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-all cursor-pointer group">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{category.icon}</span>
        <div>
          <p className="font-medium text-sm">{category.name}</p>
          <p className="text-xs text-muted-foreground">{category.count} articles</p>
        </div>
      </div>
      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
    </div>
  )
}

function PopularNewsCard({ blog }: { blog: Blog }) {
  return (
    <div className="flex gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-all cursor-pointer group">
      <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
        {blog.cover_image ? (
          <img
            src={blog.cover_image}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <span className="text-lg opacity-30">📄</span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <Badge variant="outline" className="text-[10px] mb-1 border-primary/30 text-primary">
          {blog.tags?.[0] || 'Article'}
        </Badge>
        <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
          {blog.title}
        </h4>
      </div>
    </div>
  )
}

export function BlogPage() {
  const { blogs, loading, error } = useBlogs()
  const { categories } = useCategories()

  return (
    <div id="main-content" className="min-h-screen bg-background">
      <BlogHeader />
      {/* Main Content with Sidebar */}
      <main className="max-w-6xl mx-auto px-4 pt-24 pb-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Area - Left */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-destructive mb-2">Error: {error}</p>
                <p className="text-sm text-muted-foreground">Please check your connection</p>
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-6xl mb-4 opacity-30">📝</p>
                <p className="text-xl font-medium mb-2">No articles yet</p>
                <p className="text-muted-foreground">Check back soon for new content!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {blogs.map((blog, index) => (
                  <motion.div
                    key={blog.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <BlogCard blog={blog} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar - Right */}
          <aside className="lg:w-80 space-y-6">
            {/* Author Card */}
            <AuthorSidebar />

            {/* Search */}
            <div className="relative">
              <Input
                placeholder="Search articles..."
                className="pr-10 bg-secondary/50 border-primary/10 focus:border-primary/30"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>

            {/* Categories */}
            <div className="bg-card rounded-2xl p-5 shadow-lg">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full" />
                Explore Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <CategoryCard key={category.name} category={category} />
                ))}
              </div>
            </div>

            {/* Popular News */}
            <div className="bg-card rounded-2xl p-5 shadow-lg">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full" />
                Popular News
              </h3>
              <div className="space-y-1">
                {blogs.slice(0, 4).map((blog) => (
                  <PopularNewsCard key={blog.id} blog={blog} />
                ))}
              </div>
            </div>

            {/* Newsletter CTA */}
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-5 border border-primary/20">
              <h3 className="text-lg font-bold mb-2">Subscribe</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get the latest articles delivered to your inbox.
              </p>
              <Input
                placeholder="Your email"
                className="mb-3 bg-background/50"
              />
              <Button className="w-full">Subscribe</Button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
