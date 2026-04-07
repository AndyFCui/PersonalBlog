/**
 * [INPUT]: 依赖 useState, Button, Input, Card, supabase
 * [OUTPUT]: 导出 WorkExperienceForm 组件
 * [POS]: resume-editor 模块的子组件，编辑工作经历
 * [PROTOCOL]: 变更时更新此头部
 */
import { useState } from 'react'
import { Upload, Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { STORAGE_BASE } from './utils'
import type { WorkExperience } from '@/types/resume'

interface WorkExperienceFormProps {
  workExperiences: WorkExperience[]
  onUpdate: (index: number, field: string, value: string | string[]) => void
  onAdd: () => void
  onRemove: (index: number) => void
}

export function WorkExperienceForm({
  workExperiences,
  onUpdate,
  onAdd,
  onRemove,
}: WorkExperienceFormProps) {
  const [uploadingWork, setUploadingWork] = useState<number | null>(null)

  const handleWorkImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingWork(index)
    const fileExt = file.name.split('.').pop()
    const fileName = `work-${index}-${Date.now()}.${fileExt}`

    try {
      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(fileName, file, { cacheControl: '3600', upsert: true })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName)

      onUpdate(index, 'image', urlData.publicUrl)
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setUploadingWork(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Work Experience</CardTitle>
          <Button size="sm" variant="outline" onClick={onAdd}>
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {workExperiences.map((work, index) => (
          <div key={index} className="p-4 border border-border rounded-xl space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-muted-foreground">
                #{index + 1}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onRemove(index)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Company</label>
                <Input
                  value={work.company}
                  onChange={(e) => onUpdate(index, 'company', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={work.title}
                  onChange={(e) => onUpdate(index, 'title', e.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Years</label>
                <Input
                  value={work.years}
                  onChange={(e) => onUpdate(index, 'years', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Company Logo</label>
                <div className="flex items-center gap-2">
                  {work.image && (
                    <img
                      src={
                        work.image.startsWith('http')
                          ? work.image
                          : STORAGE_BASE + work.image
                      }
                      alt=""
                      className="w-12 h-12 rounded object-cover"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleWorkImageUpload(e, index)}
                    className="hidden"
                    id={`work-img-${index}`}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      document.getElementById(`work-img-${index}`)?.click()
                    }
                    disabled={uploadingWork === index}
                  >
                    <Upload className="h-4 w-4 mr-1" />{' '}
                    {uploadingWork === index ? 'Uploading...' : 'Upload'}
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
                value={work.description.join('\n')}
                onChange={(e) =>
                  onUpdate(index, 'description', e.target.value.split('\n'))
                }
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
