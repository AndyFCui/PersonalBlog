import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Folder, ArrowRight, ArrowLeft } from 'lucide-react'
import { useCategories } from '@/hooks/useCategories'
import { BlogHeader } from '@/components/blog-header'

export function BlogCategoriesPage() {
  const { categories, loading, error } = useCategories()

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
              <Folder className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold dark:text-white">Categories</h1>
          </div>
          <p className="text-muted-foreground">
            Browse articles by category. Each category shows how many published articles it contains.
          </p>
        </motion.div>

        {/* Categories List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-destructive mb-2">Error: {error}</p>
            <p className="text-sm text-muted-foreground">Please check your connection</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4 opacity-30">📁</p>
            <p className="text-xl font-medium mb-2">No categories yet</p>
            <p className="text-muted-foreground">Categories will appear here once created in the admin panel.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/blog?category=${category.id}`}>
                  <div className="flex items-center justify-between p-6 rounded-xl bg-card hover:bg-secondary transition-all group border border-border/50">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{category.icon}</span>
                      <div>
                        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {category.count} {category.count === 1 ? 'article' : 'articles'}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Stats */}
        {!loading && categories.length > 0 && (
          <div className="mt-12 text-center text-sm text-muted-foreground">
            Total {categories.length} categories
          </div>
        )}
      </main>
    </div>
  )
}
