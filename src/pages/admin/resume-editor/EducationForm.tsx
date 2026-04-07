/**
 * [INPUT]: 依赖 useState, Button, Input, Card, supabase
 * [OUTPUT]: 导出 EducationForm 组件
 * [POS]: resume-editor 模块的子组件，编辑教育经历
 * [PROTOCOL]: 变更时更新此头部
 */
import { useState } from 'react'
import { Upload, Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { STORAGE_BASE } from './utils'
import type { Education } from '@/types/resume'

interface EducationFormProps {
  educations: Education[]
  onUpdate: (index: number, field: string, value: string) => void
  onAdd: () => void
  onRemove: (index: number) => void
}

export function EducationForm({
  educations,
  onUpdate,
  onAdd,
  onRemove,
}: EducationFormProps) {
  const [uploadingEdu, setUploadingEdu] = useState<number | null>(null)

  const handleEducationImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingEdu(index)
    const fileExt = file.name.split('.').pop()
    const fileName = `edu-${index}-${Date.now()}.${fileExt}`

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
      setUploadingEdu(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Education</CardTitle>
          <Button size="sm" variant="outline" onClick={onAdd}>
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {educations.map((edu, index) => (
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
                <label className="text-sm font-medium">School</label>
                <Input
                  value={edu.school}
                  onChange={(e) => onUpdate(index, 'school', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Degree</label>
                <Input
                  value={edu.degree}
                  onChange={(e) => onUpdate(index, 'degree', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Graduated</label>
                <Input
                  value={edu.graduated}
                  onChange={(e) => onUpdate(index, 'graduated', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Relevant Coursework (comma-separated)
                </label>
                <Input
                  value={edu.Coursework}
                  onChange={(e) =>
                    onUpdate(index, 'Coursework', e.target.value)
                  }
                  placeholder="Wireless Communication Networks, Automata Theory, Unix Programming..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">School Logo</label>
                <div className="flex items-center gap-2">
                  {edu.image && (
                    <img
                      src={
                        edu.image.startsWith('http')
                          ? edu.image
                          : STORAGE_BASE + edu.image
                      }
                      alt=""
                      className="w-12 h-12 rounded object-cover"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleEducationImageUpload(e, index)}
                    className="hidden"
                    id={`edu-img-${index}`}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      document.getElementById(`edu-img-${index}`)?.click()
                    }
                    disabled={uploadingEdu === index}
                  >
                    <Upload className="h-4 w-4 mr-1" />{' '}
                    {uploadingEdu === index ? 'Uploading...' : 'Upload'}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">School Link</label>
                <Input
                  value={edu.schoolLink || ''}
                  onChange={(e) =>
                    onUpdate(index, 'schoolLink', e.target.value)
                  }
                  placeholder="https://www.example.edu/"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Relevant Coursework
              </label>
              <Input
                value={edu.description}
                onChange={(e) =>
                  onUpdate(index, 'description', e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Honors</label>
              <Input
                value={edu.honor}
                onChange={(e) => onUpdate(index, 'honor', e.target.value)}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
