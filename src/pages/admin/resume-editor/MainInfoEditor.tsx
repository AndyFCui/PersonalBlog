/**
 * [INPUT]: 依赖 useState, supabase, CropModal
 * [OUTPUT]: 导出 MainInfoEditor 组件
 * [POS]: resume-editor 模块的子组件，编辑 Main Info
 * [PROTOCOL]: 变更时更新此头部
 */
import { useState } from 'react'
import { Upload, Image as ImageIcon, Plus, Trash2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import type { MainData } from '@/types/resume'
import { CropModal } from './CropModal'

interface MainInfoEditorProps {
  data: MainData
  onChange: (d: MainData) => void
  onSave: () => void
  saving: boolean
}

export function MainInfoEditor({ data, onChange, onSave, saving }: MainInfoEditorProps) {
  const [uploading, setUploading] = useState(false)
  const [showCropModal, setShowCropModal] = useState(false)
  const [pendingCropFile, setPendingCropFile] = useState<File | null>(null)
  const [cropField, setCropField] = useState<string>('')

  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCropField(field)
    setPendingCropFile(file)
    setShowCropModal(true)
  }

  const handleCropConfirm = (croppedFile: File) => {
    setShowCropModal(false)
    uploadCroppedImage(croppedFile, cropField)
  }

  const uploadCroppedImage = async (file: File, field: string) => {
    setUploading(true)
    const fileExt = file.name.split('.').pop() || 'png'
    const fileName = `${field}-${Date.now()}.${fileExt}`

    try {
      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(fileName, file, { cacheControl: '3600', upsert: true })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName)

      onChange({ ...data, [field]: urlData.publicUrl })
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setUploading(false)
      setPendingCropFile(null)
    }
  }

  const updateSocial = (index: number, field: string, value: string) => {
    const newSocial = [...data.social]
    newSocial[index] = { ...newSocial[index], [field]: value }
    onChange({ ...data, social: newSocial })
  }

  const addSocial = () => {
    onChange({ ...data, social: [...data.social, { name: '', url: '', className: '' }] })
  }

  const removeSocial = (index: number) => {
    onChange({ ...data, social: data.social.filter((_, i) => i !== index) })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input value={data.name} onChange={(e) => onChange({ ...data, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Occupation</label>
              <Input value={data.occupation} onChange={(e) => onChange({ ...data, occupation: e.target.value })} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Bio</label>
            <textarea
              className="w-full min-h-[100px] px-4 py-3 rounded-xl border border-input bg-secondary text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              value={data.bio}
              onChange={(e) => onChange({ ...data, bio: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Profile Image</label>
            <div className="flex items-center gap-4">
              {data.image ? (
                <>
                  <img src={data.image} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
                  <input type="file" accept="image/*" onChange={(e) => handleSelectImage(e, 'image')} className="hidden" id="image-upload" />
                  <Button variant="outline" onClick={() => document.getElementById('image-upload')?.click()} disabled={uploading}>
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? 'Uploading...' : 'Replace Image'}
                  </Button>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <input type="file" accept="image/*" onChange={(e) => handleSelectImage(e, 'image')} className="hidden" id="image-upload" />
                  <Button variant="outline" onClick={() => document.getElementById('image-upload')?.click()} disabled={uploading}>
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? 'Uploading...' : 'Upload Image'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Intro</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Input value={data.intro.role} onChange={(e) => onChange({ ...data, intro: { ...data.intro, role: e.target.value } })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Company</label>
              <Input value={data.intro.company} onChange={(e) => onChange({ ...data, intro: { ...data.intro, company: e.target.value } })} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Contact</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" value={data.email} onChange={(e) => onChange({ ...data, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input value={data.phone} onChange={(e) => onChange({ ...data, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">City</label>
              <Input value={data.city} onChange={(e) => onChange({ ...data, city: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Website</label>
              <Input value={data.website} onChange={(e) => onChange({ ...data, website: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Contact Message</label>
            <Input value={data.contactmessage} onChange={(e) => onChange({ ...data, contactmessage: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Social Links</CardTitle>
            <Button size="sm" variant="outline" onClick={addSocial}><Plus className="h-4 w-4 mr-1" /> Add</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.social.map((link, index) => (
            <div key={index} className="flex gap-2 items-start">
              <div className="flex-1 grid grid-cols-3 gap-2">
                <Input placeholder="Name" value={link.name} onChange={(e) => updateSocial(index, 'name', e.target.value)} />
                <Input placeholder="URL" value={link.url} onChange={(e) => updateSocial(index, 'url', e.target.value)} className="col-span-2" />
              </div>
              <Button size="icon-sm" variant="ghost" onClick={() => removeSocial(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onSave} disabled={saving}><Save className="h-4 w-4 mr-2" />{saving ? 'Saving...' : 'Save Main Info'}</Button>
      </div>

      <CropModal
        open={showCropModal}
        onClose={() => setShowCropModal(false)}
        imageFile={pendingCropFile}
        onCrop={handleCropConfirm}
      />
    </div>
  )
}
