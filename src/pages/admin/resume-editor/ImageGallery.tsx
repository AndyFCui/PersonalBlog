/**
 * [INPUT]: 依赖 useState, useEffect, supabase, Button, Card
 * [OUTPUT]: 导出 ImageGallery 组件
 * [POS]: resume-editor 模块的子组件，图片库管理
 * [PROTOCOL]: 变更时更新此头部
 */
import { useState, useEffect } from 'react'
import {
  Upload,
  Trash2,
  Image as ImageIcon,
  Copy,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { STORAGE_BASE } from './utils'

export function ImageGallery() {
  const [images, setImages] = useState<{ name: string; url: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    setLoading(true)
    setError(null)
    try {
      const folders = [
        '',
        'images',
        'portfolio',
        'images/portfolio',
        'images/logos',
        'images/education',
      ]
      const allFiles: { name: string; url: string }[] = []

      for (const folder of folders) {
        const { data, error } = await supabase.storage
          .from('blog-images')
          .list(folder, { limit: 200 })

        if (error) {
          console.error('Supabase error for folder', folder, ':', error)
          continue
        }

        const imageUrls = (data || [])
          .filter((file) => {
            if (!file.id || !file.name) return false
            const ext = file.name.toLowerCase()
            return (
              ext.endsWith('.jpg') ||
              ext.endsWith('.jpeg') ||
              ext.endsWith('.png') ||
              ext.endsWith('.gif') ||
              ext.endsWith('.webp') ||
              ext.endsWith('.svg')
            )
          })
          .map((file) => ({
            name: folder ? `${folder}/${file.name}` : file.name,
            url: STORAGE_BASE + (folder ? `${folder}/` : '') + file.name,
          }))

        allFiles.push(...imageUrls)
      }

      console.log('Filtered images:', allFiles)
      setImages(allFiles)
    } catch (err) {
      console.error('Error fetching images:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    for (const file of Array.from(files)) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

      try {
        const { error } = await supabase.storage
          .from('blog-images')
          .upload(fileName, file, { contentType: file.type, upsert: true })

        if (error) throw error
      } catch (err) {
        console.error('Upload error:', err)
      }
    }

    setUploading(false)
    fetchImages()
  }

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopiedUrl(url)
    setTimeout(() => setCopiedUrl(null), 2000)
  }

  const handleDelete = async (name: string) => {
    if (!confirm(`Delete ${name}?`)) return

    console.log('Attempting to delete:', name)

    try {
      const { data, error } = await supabase.storage
        .from('blog-images')
        .remove([name])

      console.log('Delete result:', { data, error })

      if (error) {
        console.error('Delete error:', error)
        alert('Delete failed: ' + error.message)
        return
      }

      setCopiedUrl(null)

      // Force a complete refresh
      setImages([])
      setLoading(true)
      await fetchImages()

      alert(`Deleted ${name} successfully!`)
    } catch (err) {
      console.error('Delete failed:', err)
      alert('Delete failed: ' + (err instanceof Error ? err.message : JSON.stringify(err)))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Image Library</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-destructive mb-4">Error loading images: {error}</p>
            <Button onClick={fetchImages}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Image Library</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {images.length} images uploaded
              </p>
            </div>
            <div>
              <input
                type="file"
                id="image-upload-gallery"
                accept="image/*"
                multiple
                onChange={handleUpload}
                className="hidden"
              />
              <Button
                onClick={() =>
                  document.getElementById('image-upload-gallery')?.click()
                }
                disabled={uploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Images'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {images.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No images yet. Upload some images to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img) => (
                <div
                  key={img.name}
                  className="group relative border border-border rounded-xl overflow-hidden hover:border-primary transition-colors"
                >
                  <img
                    src={img.url}
                    alt={img.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <span className="text-white text-xs mb-1">
                      Click to delete
                    </span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        console.log(
                          'Delete button clicked for:',
                          img.name,
                          img.url
                        )
                        handleDelete(img.name)
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => copyUrl(img.url)}>
                      {copiedUrl === img.url ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy URL
                        </>
                      )}
                    </Button>
                  </div>
                  {/* Always visible delete button for debugging */}
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100"
                    onClick={() => handleDelete(img.name)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                  <div className="p-2 bg-muted/50">
                    <p className="text-xs text-muted-foreground truncate">
                      {img.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>URL Format</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">
            Use these URLs in your content:
          </p>
          <code className="text-xs bg-muted p-2 rounded block">
            {STORAGE_BASE}
            {'{filename}'}
          </code>
        </CardContent>
      </Card>
    </div>
  )
}
