import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Save, Eye, X } from 'lucide-react'
import { Editor } from '@bytemd/react'
import gfm from '@bytemd/plugin-gfm'
import 'bytemd/dist/index.css'
import type { Blog } from '@/hooks/useBlogs'

const plugins = [gfm()]

interface BlogEditorProps {
  blog?: Blog
}

export function BlogEditor({ blog }: BlogEditorProps) {
  const navigate = useNavigate()
  const [title, setTitle] = useState(blog?.title || '')
  const [slug, setSlug] = useState(blog?.slug || '')
  const [excerpt, setExcerpt] = useState(blog?.excerpt || '')
  const [content, setContent] = useState(blog?.content || '')
  const [coverImage, setCoverImage] = useState(blog?.cover_image || '')
  const [tags, setTags] = useState(blog?.tags?.join(', ') || '')
  const [published, setPublished] = useState(blog?.published || false)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    // TODO: Implement Supabase save logic
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    navigate('/admin/blogs')
  }

  const generateSlug = () => {
    const generated = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    setSlug(generated)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/admin/blogs" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Blogs
            </Link>
            <h1 className="text-3xl font-bold">{blog ? 'Edit Blog Post' : 'New Blog Post'}</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link to="/blog">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Link>
            </Button>
            <Button onClick={handleSave} disabled={saving} className="shadow-lg hover:shadow-xl transition-all">
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Title & Slug */}
          <Card className="hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle className="text-lg">Basic Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={generateSlug}
                  placeholder="Enter blog title"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Slug</label>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="blog-url-slug"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Excerpt</label>
                <textarea
                  className="w-full min-h-[80px] px-4 py-3 rounded-xl border border-input bg-secondary text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief description of the post"
                />
              </div>
            </CardContent>
          </Card>

          {/* Cover Image & Tags */}
          <Card className="hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle className="text-lg">Media & Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Cover Image URL</label>
                <Input
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Tags (comma separated)</label>
                <Input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="react, typescript, tutorial"
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <Card className="hover:shadow-lg transition-all bytemd-editor-card">
            <CardHeader>
              <CardTitle className="text-lg">Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="border border-input rounded-xl overflow-hidden bytemd-editor-container"
                style={{
                  minHeight: '400px',
                  background: 'linear-gradient(135deg, rgba(0,140,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                }}
              >
                <Editor
                  value={content}
                  plugins={plugins}
                  onChange={(v) => setContent(v)}
                  placeholder="Write your blog content..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Publish */}
          <Card className="hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle className="text-lg">Publishing</CardTitle>
            </CardHeader>
            <CardContent>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`relative w-12 h-6 rounded-full transition-all ${published ? 'bg-primary' : 'bg-secondary'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-all ${published ? 'left-7' : 'left-1'}`} />
                </div>
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="sr-only"
                />
                <span className="text-sm font-medium">
                  {published ? 'Published' : 'Draft'}
                </span>
              </label>
              <p className="text-xs text-muted-foreground mt-2">
                {published ? 'This post is visible to everyone' : 'Only you can see this post'}
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" asChild>
              <Link to="/admin/blogs">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Link>
            </Button>
            <Button onClick={handleSave} disabled={saving || !title} className="shadow-lg hover:shadow-xl transition-all">
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Post'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
