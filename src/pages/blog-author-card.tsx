import { Link } from 'react-router-dom'
import { Github, Mail, Globe } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useAuthor } from '@/hooks/useAuthor'
import { useCategories } from '@/hooks/useCategories'
import { useBlogs } from '@/hooks/useBlogs'

function AuthorCard() {
  const { author, loading } = useAuthor()

  if (loading) {
    return (
      <div className="bg-card rounded-2xl p-6 shadow-lg animate-pulse">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-secondary mb-4" />
          <div className="h-5 w-32 bg-secondary rounded mb-2" />
          <div className="h-4 w-24 bg-secondary rounded" />
        </div>
      </div>
    )
  }

  if (!author) return null

  return (
    <div className="bg-card rounded-2xl p-6 shadow-lg">
      {/* Avatar */}
      <Link to="/" className="flex flex-col items-center mb-4 hover:opacity-80 transition-opacity">
        <Avatar className="w-20 h-20 mb-4 ring-4 ring-primary/20">
          <AvatarImage src={author.avatar_url || '/images/profilepic.jpg'} alt={author.name} />
          <AvatarFallback className="text-xl bg-gradient-to-br from-primary to-accent text-white">
            {author.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <h3 className="text-lg font-bold text-center">{author.name}</h3>
      </Link>
      {author.bio && (
        <p className="text-sm text-muted-foreground text-center mt-1 italic">
          {author.bio}
        </p>
      )}

      {/* Social Links */}
      <div className="space-y-2">
        {author.github && (
          <a
            href={author.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <Github className="w-5 h-5 text-foreground/70" />
            <span className="text-sm">GitHub</span>
          </a>
        )}
        {author.email && (
          <a
            href={`mailto:${author.email}`}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <Mail className="w-5 h-5 text-foreground/70" />
            <span className="text-sm">{author.email}</span>
          </a>
        )}
        {author.bilibili && (
          <a
            href={author.bilibili}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <span className="text-lg">📺</span>
            <span className="text-sm">Bilibili</span>
          </a>
        )}
        {author.wechat && (
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
            <span className="text-lg">💬</span>
            <span className="text-sm">{author.wechat}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function StatsCard() {
  const { blogs } = useBlogs()
  const { categories } = useCategories()

  const stats = [
    { label: '日志', value: blogs.length },
    { label: '分类', value: categories.length },
    { label: '标签', value: [...new Set(blogs.flatMap(b => b.tags || []))].length },
  ]

  return (
    <div className="bg-card rounded-2xl p-6 shadow-lg">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-primary rounded-full" />
        Statistics
      </h3>
      <div className="grid grid-cols-3 gap-4 text-center">
        {stats.map((stat) => (
          <div key={stat.label}>
            <div className="text-2xl font-bold text-primary">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AuthorSidebar() {
  return (
    <div className="space-y-6">
      <AuthorCard />
      <StatsCard />
    </div>
  )
}
