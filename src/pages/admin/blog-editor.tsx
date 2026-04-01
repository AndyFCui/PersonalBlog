import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Save, Eye, X, Upload, Image as ImageIcon } from 'lucide-react'
import { Editor } from '@bytemd/react'
import gfm from '@bytemd/plugin-gfm'
import 'bytemd/dist/index.css'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import type { Blog } from '@/hooks/useBlogs'

const plugins = [gfm()]

export function BlogEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [tags, setTags] = useState('')
  const [published, setPublished] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  // Fetch blog data if editing existing blog
  useEffect(() => {
    if (id) {
      setLoading(true)
      supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data, error: fetchError }) => {
          if (fetchError) {
            setError(fetchError.message)
          } else if (data) {
            setTitle(data.title || '')
            setSlug(data.slug || '')
            setExcerpt(data.excerpt || '')
            setContent(data.content || '')
            setCoverImage(data.cover_image || '')
            setTags(data.tags?.join(', ') || '')
            setPublished(data.published || false)
          }
          setLoading(false)
        })
    }
  }, [id])

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Title is required')
      return
    }

    setSaving(true)
    setError(null)

    const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean)
    const publishedAt = published ? new Date().toISOString() : null

    const blogData = {
      title: title.trim(),
      slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      excerpt: excerpt.trim() || null,
      content,
      cover_image: coverImage.trim() || null,
      tags: tagsArray,
      published,
      published_at: publishedAt,
    }

    try {
      if (id) {
        // Update existing blog
        const { error: updateError } = await supabase
          .from('blogs')
          .update(blogData)
          .eq('id', id)

        if (updateError) throw updateError
      } else {
        // Create new blog
        const { error: insertError } = await supabase
          .from('blogs')
          .insert(blogData)

        if (insertError) throw insertError
      }

      navigate('/admin/blogs')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save blog')
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setUploading(true)
    setError(null)

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

    try {
      const { data, error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName)

      setCoverImage(urlData.publicUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const generateSlug = () => {
    const generated = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    setSlug(generated)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
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
            <h1 className="text-3xl font-bold">{id ? 'Edit Blog Post' : 'New Blog Post'}</h1>
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

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive">
            {error}
          </div>
        )}

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
                <label className="text-sm font-medium text-foreground">Cover Image</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {coverImage ? (
                  <div className="relative rounded-xl overflow-hidden border border-border">
                    <img
                      src={coverImage}
                      alt="Cover preview"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button
                        size="icon-sm"
                        variant="secondary"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="secondary"
                        onClick={() => setCoverImage('')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {uploading && (
                      <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full h-32 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer"
                  >
                    {uploading ? (
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <ImageIcon className="h-8 w-8" />
                        <span className="text-sm">Click to upload cover image</span>
                      </>
                    )}
                  </button>
                )}
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
