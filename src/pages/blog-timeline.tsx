import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useBlogs } from '@/hooks/useBlogs'
import { BlogHeader } from '@/components/blog-header'

interface TimelineYear {
  year: string
  months: TimelineMonth[]
}

interface TimelineMonth {
  month: string
  monthIndex: number
  articles: TimelineArticle[]
}

interface TimelineArticle {
  id: string
  title: string
  slug: string
  published_at: string | null
  tags: string[]
}

export function BlogTimelinePage() {
  const { blogs, loading } = useBlogs()

  // Group articles by year and month
  const timelineData = (() => {
    const yearMap = new Map<string, Map<string, TimelineArticle[]>>()

    blogs.forEach((blog) => {
      if (!blog.published_at) return
      const date = new Date(blog.published_at)
      const year = date.getFullYear().toString()
      const monthIndex = date.getMonth()
      const monthName = date.toLocaleDateString('en-US', { month: 'long' })

      if (!yearMap.has(year)) {
        yearMap.set(year, new Map())
      }
      const monthMap = yearMap.get(year)!
      if (!monthMap.has(monthName)) {
        monthMap.set(monthName, [])
      }
      monthMap.get(monthName)!.push({
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
        published_at: blog.published_at,
        tags: blog.tags || [],
      })
    })

    // Convert to array sorted by year descending
    const result: TimelineYear[] = []
    yearMap.forEach((monthMap, year) => {
      const months: TimelineMonth[] = []
      monthMap.forEach((articles, month) => {
        months.push({
          month,
          monthIndex: new Date(`${month} 1, ${year}`).getMonth(),
          articles: articles.sort(
            (a, b) =>
              new Date(b.published_at!).getTime() - new Date(a.published_at!).getTime()
          ),
        })
      })
      // Sort months descending
      months.sort((a, b) => b.monthIndex - a.monthIndex)
      result.push({ year, months })
    })

    // Sort years descending
    result.sort((a, b) => parseInt(b.year) - parseInt(a.year))
    return result
  })()

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
              <Calendar className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold dark:text-white">Timeline</h1>
          </div>
          <p className="text-muted-foreground">
            Browse articles chronologically. Articles are organized by year and month.
          </p>
        </motion.div>

        {/* Timeline */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : timelineData.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4 opacity-30">📅</p>
            <p className="text-xl font-medium mb-2">No articles yet</p>
            <p className="text-muted-foreground">Articles will appear here once published.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-[22px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-transparent" />

            <div className="space-y-12">
              {timelineData.map((yearData, yearIdx) => (
                <motion.div
                  key={yearData.year}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: yearIdx * 0.1 }}
                >
                  {/* Year Marker */}
                  <div className="relative flex items-center gap-4 mb-6">
                    <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg shadow-lg">
                      {yearData.year.slice(2)}
                    </div>
                    <h2 className="text-2xl font-bold dark:text-white">{yearData.year}</h2>
                  </div>

                  {/* Months */}
                  <div className="ml-6 md:ml-14 space-y-8">
                    {yearData.months.map((monthData) => (
                      <div key={monthData.month}>
                        {/* Month Header */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-3 h-3 rounded-full bg-accent border-2 border-primary" />
                          <h3 className="text-lg font-semibold text-muted-foreground">
                            {monthData.month}
                          </h3>
                        </div>

                        {/* Articles */}
                        <div className="ml-6 space-y-3 border-l-2 border-border/50 pl-6">
                          {monthData.articles.map((article, idx) => (
                            <motion.div
                              key={article.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                            >
                              <Link to={`/blog/${article.slug}`}>
                                <div className="p-4 rounded-xl bg-card hover:bg-secondary transition-all border border-border/50 group">
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-medium group-hover:text-primary transition-colors line-clamp-1">
                                        {article.title}
                                      </h4>
                                      <div className="flex items-center gap-2 mt-1">
                                        {article.tags.slice(0, 2).map((tag) => (
                                          <Badge
                                            key={tag}
                                            variant="outline"
                                            className="text-[10px] border-primary/30 text-primary"
                                          >
                                            {tag}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                    <div className="text-xs text-muted-foreground flex-shrink-0">
                                      {article.published_at &&
                                        new Date(article.published_at).toLocaleDateString('en-US', {
                                          month: 'short',
                                          day: 'numeric',
                                        })}
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
