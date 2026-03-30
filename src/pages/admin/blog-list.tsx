import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, FileText, Settings, ArrowLeft, Edit2, Trash2, Eye, LogOut, Tag, User } from 'lucide-react'
import { useBlogs, type Blog } from '@/hooks/useBlogs'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth-context'

function BlogRow({ blog }: { blog: Blog }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary/80 transition-all">
      <div className="flex-1">
        <h3 className="font-semibold text-foreground">{blog.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-1">{blog.excerpt || 'No excerpt'}</p>
      </div>
      <div className="flex items-center gap-2 ml-4">
        {blog.published ? (
          <Badge variant="default" className="bg-primary/20 text-primary border-primary/30">
            Published
          </Badge>
        ) : (
          <Badge variant="outline" className="text-muted-foreground">
            Draft
          </Badge>
        )}
        <Button size="icon-sm" variant="ghost" asChild>
          <Link to={`/admin/blog/${blog.id}/edit`}>
            <Edit2 className="h-4 w-4" />
          </Link>
        </Button>
        <Button size="icon-sm" variant="ghost" className="text-destructive hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export function AdminBlogList() {
  const { blogs, loading, error } = useBlogs()
  const { signOut, user } = useAuth()

  const handleLogout = async () => {
    await signOut()
  }

  const publishedCount = blogs.filter(b => b.published).length

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Portfolio
            </Link>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            {user && <p className="text-sm text-muted-foreground mt-1">{user.email}</p>}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-primary">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
            <Button asChild className="shadow-lg hover:shadow-xl transition-all">
              <Link to="/admin/blog/new">
                <Plus className="h-4 w-4 mr-2" />
                New Blog Post
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Posts
              </CardTitle>
              <FileText className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{blogs.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Published: {publishedCount}</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Resume Data
              </CardTitle>
              <Settings className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">Active</div>
              <p className="text-xs text-muted-foreground mt-1">Synced with Supabase</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Quick Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link to="/design-system">
                  <Eye className="h-4 w-4 mr-2" />
                  Design System
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link to="/blog">
                  <FileText className="h-4 w-4 mr-2" />
                  View Blog
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link to="/admin/categories">
                  <Tag className="h-4 w-4 mr-2" />
                  Manage Categories
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link to="/admin/author">
                  <User className="h-4 w-4 mr-2" />
                  Author Profile
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Blog Posts List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Blog Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-destructive mb-2">Error: {error}</p>
                <p className="text-sm text-muted-foreground">Please check your Supabase connection</p>
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No blog posts yet</p>
                <p className="text-sm mb-4">Create your first blog post to get started</p>
                <Button asChild>
                  <Link to="/admin/blog/new">Create Blog Post</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {blogs.map((blog) => (
                  <BlogRow key={blog.id} blog={blog} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
