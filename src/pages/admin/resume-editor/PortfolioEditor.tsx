/**
 * [INPUT]: 依赖 useState, flushSync, supabase, Button, Input, Card, PortfolioData
 * [OUTPUT]: 导出 PortfolioEditor 组件
 * [POS]: resume-editor 模块的子组件，编辑作品集
 * [PROTOCOL]: 变更时更新此头部
 */
import { useState } from 'react'
import { flushSync } from 'react-dom'
import { Upload, Trash2, Plus, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { STORAGE_BASE } from './utils'
import type { PortfolioData } from '@/types/resume'

interface PortfolioEditorProps {
  data: PortfolioData
  onChange: (d: PortfolioData) => void
  onSave: () => void
  saving: boolean
}

export function PortfolioEditor({
  data,
  onChange,
  onSave,
  saving,
}: PortfolioEditorProps) {
  const updateProject = (index: number, field: string, value: string | string[]) => {
    const newProjects = [...data.projects]
    newProjects[index] = { ...newProjects[index], [field]: value }
    onChange({ ...data, projects: newProjects })
  }

  const addProject = () => {
    const newData = {
      ...data,
      projects: [
        ...data.projects,
        { title: '', category: '', description: [''], image: '', url: '' },
      ],
    }
    flushSync(() => {
      onChange(newData)
    })
  }

  const removeProject = (index: number) => {
    const newData = {
      ...data,
      projects: data.projects.filter((_, i) => i !== index),
    }
    flushSync(() => {
      onChange(newData)
    })
  }

  const [uploading, setUploading] = useState<string | null>(null)

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(`project-${index}`)
    const fileExt = file.name.split('.').pop()
    const fileName = `project-${index}-${Date.now()}.${fileExt}`

    try {
      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(fileName, file, { cacheControl: '3600', upsert: true })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName)

      updateProject(index, 'image', urlData.publicUrl)
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setUploading(null)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Projects</CardTitle>
            <Button size="sm" variant="outline" onClick={addProject}>
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {data.projects.map((project, index) => (
            <div
              key={index}
              className="p-4 border border-border rounded-xl space-y-4"
            >
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-muted-foreground">
                  #{index + 1}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeProject(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={project.title}
                    onChange={(e) =>
                      updateProject(index, 'title', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Input
                    value={project.category}
                    onChange={(e) =>
                      updateProject(index, 'category', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">URL</label>
                  <Input
                    value={project.url}
                    onChange={(e) =>
                      updateProject(index, 'url', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Image</label>
                  <div className="flex items-center gap-2">
                    {project.image && (
                      <img
                        src={
                          project.image.startsWith('http')
                            ? project.image
                            : STORAGE_BASE + project.image
                        }
                        alt=""
                        className="w-12 h-12 rounded object-cover"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, index)}
                      className="hidden"
                      id={`project-img-${index}`}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        document
                          .getElementById(`project-img-${index}`)
                          ?.click()
                      }
                      disabled={uploading === `project-${index}`}
                    >
                      <Upload className="h-4 w-4 mr-1" />{' '}
                      {uploading === `project-${index}`
                        ? 'Uploading...'
                        : 'Upload'}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Description (one per line)
                </label>
                <textarea
                  className="w-full min-h-[100px] px-4 py-3 rounded-xl border border-input bg-secondary text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  value={project.description.join('\n')}
                  onChange={(e) =>
                    updateProject(
                      index,
                      'description',
                      e.target.value.split('\n')
                    )
                  }
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Portfolio'}
        </Button>
      </div>
    </div>
  )
}
