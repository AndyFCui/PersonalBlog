import { useState, useEffect, useRef } from 'react'
import { flushSync } from 'react-dom'
import { Link } from 'react-router-dom'
import { ArrowLeft, Save, Plus, Trash2, Upload, Image as ImageIcon, GripVertical, Grid, Copy, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useResumeAdmin } from '@/hooks/useResumeAdmin'
import type { ResumeDataJSON, MainData, ResumeData, PortfolioData, WorkExperience, Education, PortfolioProject } from '@/types/resume'
import { supabase } from '@/lib/supabase'
import ReactCrop from 'react-image-crop'

/* ------------------------- 工具函数：安全深拷贝 ------------------------- */
function deepClone<T>(obj: T): T {
  if (!obj) return obj
  try {
    // Use JSON round-trip for plain data objects
    // This handles React state objects correctly (removes functions, DOM nodes, etc.)
    return JSON.parse(JSON.stringify(obj))
  } catch {
    // If JSON fails (circular ref), return as-is
    return obj
  }
}
interface Crop {
  unit: 'px' | '%'
  x: number
  y: number
  width: number
  height: number
}

// Tabs
const TABS = ['Main Info', 'Resume', 'Portfolio', 'Images']

// Base URL for Supabase storage
const STORAGE_BASE = 'https://rlrzmqbdpjkpxbfdgnlm.supabase.co/storage/v1/object/public/blog-images/'

export function AdminResumeEditor() {
  const { data, loading, error, saveMain, saveResume, savePortfolio, saveAll, refresh } = useResumeAdmin()
  const [activeTab, setActiveTab] = useState('Main Info')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isDirty, setIsDirty] = useState(false)

  // Form states
  const [mainData, setMainData] = useState<MainData | null>(null)
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null)

  // Use refs to always have latest data (avoids state batching issues)
  const mainDataRef = useRef<MainData | null>(null)
  const resumeDataRef = useRef<ResumeData | null>(null)
  const portfolioDataRef = useRef<PortfolioData | null>(null)

  // Track original data for dirty checking
  const [originalData, setOriginalData] = useState<ResumeDataJSON | null>(null)

  useEffect(() => {
    if (data) {
      setMainData(data.main)
      setResumeData(data.resume)
      setPortfolioData(data.portfolio)
      setOriginalData(data)
      // Also update refs
      mainDataRef.current = data.main
      resumeDataRef.current = data.resume
      portfolioDataRef.current = data.portfolio
    }
  }, [data])

  // Update refs when state changes
  useEffect(() => {
    mainDataRef.current = mainData
  }, [mainData])

  useEffect(() => {
    resumeDataRef.current = resumeData
  }, [resumeData])

  useEffect(() => {
    portfolioDataRef.current = portfolioData
  }, [portfolioData])

  // Check if data has changed
  useEffect(() => {
    if (!originalData || !data) return
    const dirty = JSON.stringify({ main: mainData, resume: resumeData, portfolio: portfolioData }) !==
                  JSON.stringify({ main: originalData.main, resume: originalData.resume, portfolio: originalData.portfolio })
    setIsDirty(dirty)
  }, [mainData, resumeData, portfolioData, originalData, data])

  const handleSave = async (passedResumeData?: ResumeData) => {
    setSaving(true)
    setSaved(false)
    try {
      // Use passed data if available, otherwise fall back to refs
      const mainToSave = mainDataRef.current
      const resumeToSave = passedResumeData ?? resumeDataRef.current
      const portfolioToSave = portfolioDataRef.current

      // Guard: ensure we're saving plain data objects, not DOM elements or events
      if (!resumeToSave || typeof resumeToSave !== 'object' || resumeToSave instanceof Event || resumeToSave instanceof HTMLElement) {
        throw new Error('Invalid resume data: expected plain object')
      }

      console.log('=== HANDLE SAVE ===')
      console.log('resumeToSave work count:', resumeToSave?.work?.length)

      // Deep clone to remove any circular references or React internals
      const cleanMain = mainToSave ? deepClone(mainToSave) : null
      const cleanResume = resumeToSave ? deepClone(resumeToSave) : null
      const cleanPortfolio = portfolioToSave ? deepClone(portfolioToSave) : null

      console.log('cleanResume work count:', cleanResume?.work?.length)
      console.log('Saving main...', cleanMain?.name, cleanMain?.occupation)
      await saveMain(cleanMain)
      console.log('Main saved successfully')

      console.log('Saving resume...')
      await saveResume(cleanResume)
      console.log('Resume saved successfully')

      if (cleanPortfolio) {
        console.log('Saving portfolio...')
        await savePortfolio(cleanPortfolio)
        console.log('Portfolio saved successfully')
      }

      // Sync avatar to authors table if image changed
      const newImage = mainData?.image
      if (newImage && originalData?.main.image !== newImage) {
        await supabase
          .from('authors')
          .update({ avatar_url: newImage })
          .neq('id', '00000000-0000-0000-0000-000000000000')
          .then(async ({ error }) => {
            if (error) {
              console.error('Failed to sync avatar to authors:', error)
            } else {
              console.log('Avatar synced to authors table')
            }
          })
      }

      // Refresh data from database to update UI
      await refresh()

      setSaved(true)
      setLastSaved(new Date())
      setIsDirty(false)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error('Save error:', err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 bg-secondary rounded" />
            <div className="h-64 bg-secondary rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-destructive">Error: {error || 'No data'}</p>
          <Button onClick={refresh} className="mt-4">Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              to="/admin/blogs"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold">Resume Editor</h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
              {lastSaved && (
                <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
              )}
              {isDirty && !saving && (
                <span className="text-yellow-500">• Unsaved changes</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {saved && <span className="text-sm text-green-500 font-medium">Saved!</span>}
            <Button onClick={() => handleSave(resumeData)} disabled={saving || !isDirty} className="shadow-lg">
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save All'}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border pb-4">
          {TABS.map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'Main Info' && mainData && (
          <MainInfoEditor data={mainData} onChange={setMainData} onSave={() => saveMain(mainData)} saving={saving} />
        )}
        {activeTab === 'Resume' && resumeData && (
          <ResumeEditor
            data={resumeData}
            onChange={setResumeData}
            onSave={handleSave}
            saving={saving}
          />
        )}
        {activeTab === 'Portfolio' && portfolioData && (
          <PortfolioEditor data={portfolioData} onChange={setPortfolioData} onSave={() => savePortfolio(portfolioData)} saving={saving} />
        )}
        {activeTab === 'Images' && (
          <ImageGallery />
        )}
      </div>
    </div>
  )
}

// Main Info Editor
function MainInfoEditor({ data, onChange, onSave, saving }: { data: MainData, onChange: (d: MainData) => void, onSave: () => void, saving: boolean }) {
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

// Resume Editor
function ResumeEditor({ data, onChange, onSave, saving }: {
  data: ResumeData,
  onChange: (d: ResumeData) => void,
  onSave: (data?: ResumeData) => void,  // Accept optional data param
  saving: boolean
}) {
  const updateWork = (index: number, field: string, value: any) => {
    const newWork = [...data.work]
    newWork[index] = { ...newWork[index], [field]: value }
    onChange({ ...data, work: newWork })
  }

  const addWork = () => {
    const newData = {
      ...data,
      work: [...data.work, { company: '', title: '', years: '', image: '', description: [''] }]
    }
    flushSync(() => {
      onChange(newData)
    })
    // Don't auto-save - user must manually save via "Save All"
  }

  const removeWork = (index: number) => {
    const newData = { ...data, work: data.work.filter((_, i) => i !== index) }
    flushSync(() => {
      onChange(newData)
    })
    // Don't auto-save - user must manually save via "Save All"
  }

  const updateEducation = (index: number, field: string, value: any) => {
    const newEdu = [...data.education]
    newEdu[index] = { ...newEdu[index], [field]: value }
    onChange({ ...data, education: newEdu })
  }

  const addEducation = () => {
    const newData = {
      ...data,
      education: [...data.education, { school: '', degree: '', graduated: '', Coursework: '', description: '', image: '', honor: '', awards: '' }]
    }
    flushSync(() => {
      onChange(newData)
    })
    // Don't auto-save - user must manually save via "Save All"
  }

  const removeEducation = (index: number) => {
    const newData = { ...data, education: data.education.filter((_, i) => i !== index) }
    flushSync(() => {
      onChange(newData)
    })
    // Don't auto-save - user must manually save via "Save All"
  }

  const [uploadingWork, setUploadingWork] = useState<number | null>(null)
  const [uploadingEdu, setUploadingEdu] = useState<number | null>(null)

  const handleWorkImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
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

      updateWork(index, 'image', urlData.publicUrl)
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setUploadingWork(null)
    }
  }

  const handleEducationImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
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

      updateEducation(index, 'image', urlData.publicUrl)
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setUploadingEdu(null)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Work Experience</CardTitle>
            <Button size="sm" variant="outline" onClick={addWork}><Plus className="h-4 w-4 mr-1" /> Add</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {data.work.map((work, index) => (
            <div key={index} className="p-4 border border-border rounded-xl space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                <Button size="sm" variant="ghost" onClick={() => removeWork(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company</label>
                  <Input value={work.company} onChange={(e) => updateWork(index, 'company', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input value={work.title} onChange={(e) => updateWork(index, 'title', e.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Years</label>
                  <Input value={work.years} onChange={(e) => updateWork(index, 'years', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Logo</label>
                  <div className="flex items-center gap-2">
                    {work.image && <img src={work.image.startsWith('http') ? work.image : STORAGE_BASE + work.image} alt="" className="w-12 h-12 rounded object-cover" />}
                    <input type="file" accept="image/*" onChange={(e) => handleWorkImageUpload(e, index)} className="hidden" id={`work-img-${index}`} />
                    <Button size="sm" variant="outline" onClick={() => document.getElementById(`work-img-${index}`)?.click()} disabled={uploadingWork === index}>
                      <Upload className="h-4 w-4 mr-1" /> {uploadingWork === index ? 'Uploading...' : 'Upload'}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description (one per line)</label>
                <textarea
                  className="w-full min-h-[100px] px-4 py-3 rounded-xl border border-input bg-secondary text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  value={work.description.join('\n')}
                  onChange={(e) => updateWork(index, 'description', e.target.value.split('\n'))}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Education</CardTitle>
            <Button size="sm" variant="outline" onClick={addEducation}><Plus className="h-4 w-4 mr-1" /> Add</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {data.education.map((edu, index) => (
            <div key={index} className="p-4 border border-border rounded-xl space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                <Button size="sm" variant="ghost" onClick={() => removeEducation(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">School</label>
                  <Input value={edu.school} onChange={(e) => updateEducation(index, 'school', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Degree</label>
                  <Input value={edu.degree} onChange={(e) => updateEducation(index, 'degree', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Graduated</label>
                  <Input value={edu.graduated} onChange={(e) => updateEducation(index, 'graduated', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Coursework</label>
                  <Input value={edu.Coursework} onChange={(e) => updateEducation(index, 'Coursework', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">School Logo</label>
                  <div className="flex items-center gap-2">
                    {edu.image && <img src={edu.image.startsWith('http') ? edu.image : STORAGE_BASE + edu.image} alt="" className="w-12 h-12 rounded object-cover" />}
                    <input type="file" accept="image/*" onChange={(e) => handleEducationImageUpload(e, index)} className="hidden" id={`edu-img-${index}`} />
                    <Button size="sm" variant="outline" onClick={() => document.getElementById(`edu-img-${index}`)?.click()} disabled={uploadingEdu === index}>
                      <Upload className="h-4 w-4 mr-1" /> {uploadingEdu === index ? 'Uploading...' : 'Upload'}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Relevant Coursework</label>
                <Input value={edu.description} onChange={(e) => updateEducation(index, 'description', e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Honors</label>
                <Input value={edu.honor} onChange={(e) => updateEducation(index, 'honor', e.target.value)} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={() => onSave(data)} disabled={saving}><Save className="h-4 w-4 mr-2" />{saving ? 'Saving...' : 'Save Resume'}</Button>
      </div>
    </div>
  )
}

// Portfolio Editor
function PortfolioEditor({ data, onChange, onSave, saving }: { data: PortfolioData, onChange: (d: PortfolioData) => void, onSave: () => void, saving: boolean }) {
  const updateProject = (index: number, field: string, value: any) => {
    const newProjects = [...data.projects]
    newProjects[index] = { ...newProjects[index], [field]: value }
    onChange({ ...data, projects: newProjects })
  }

  const addProject = () => {
    const newData = {
      ...data,
      projects: [...data.projects, { title: '', category: '', description: [''], image: '', url: '' }]
    }
    flushSync(() => {
      onChange(newData)
    })
    portfolioDataRef.current = newData
  }

  const removeProject = (index: number) => {
    const newData = { ...data, projects: data.projects.filter((_, i) => i !== index) }
    flushSync(() => {
      onChange(newData)
    })
    portfolioDataRef.current = newData
  }

  const [uploading, setUploading] = useState<string | null>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(`project-${index}`)
    const fileExt = file.name.split('.').pop()
    const fileName = `project-${index}-${Date.now()}.${fileExt}`

    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
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
            <Button size="sm" variant="outline" onClick={addProject}><Plus className="h-4 w-4 mr-1" /> Add</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {data.projects.map((project, index) => (
            <div key={index} className="p-4 border border-border rounded-xl space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                <Button size="sm" variant="ghost" onClick={() => removeProject(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input value={project.title} onChange={(e) => updateProject(index, 'title', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Input value={project.category} onChange={(e) => updateProject(index, 'category', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">URL</label>
                  <Input value={project.url} onChange={(e) => updateProject(index, 'url', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Image</label>
                  <div className="flex items-center gap-2">
                    {project.image && <img src={project.image.startsWith('http') ? project.image : STORAGE_BASE + project.image} alt="" className="w-12 h-12 rounded object-cover" />}
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, index)} className="hidden" id={`project-img-${index}`} />
                    <Button size="sm" variant="outline" onClick={() => document.getElementById(`project-img-${index}`)?.click()} disabled={uploading === `project-${index}`}>
                      <Upload className="h-4 w-4 mr-1" /> {uploading === `project-${index}` ? 'Uploading...' : 'Upload'}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description (one per line)</label>
                <textarea
                  className="w-full min-h-[100px] px-4 py-3 rounded-xl border border-input bg-secondary text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  value={project.description.join('\n')}
                  onChange={(e) => updateProject(index, 'description', e.target.value.split('\n'))}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onSave} disabled={saving}><Save className="h-4 w-4 mr-2" />{saving ? 'Saving...' : 'Save Portfolio'}</Button>
      </div>
    </div>
  )
}

// Image Gallery Component
function ImageGallery() {
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
      // List files from root and common subdirectories
      const folders = ['', 'images', 'portfolio', 'images/portfolio', 'images/logos', 'images/education']
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
            return ext.endsWith('.jpg') || ext.endsWith('.jpeg') || ext.endsWith('.png') || ext.endsWith('.gif') || ext.endsWith('.webp') || ext.endsWith('.svg')
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

      // Clear copied URL state if deleted the same image
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
                onClick={() => document.getElementById('image-upload-gallery')?.click()}
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
                    <span className="text-white text-xs mb-1">Click to delete</span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        console.log('Delete button clicked for:', img.name, img.url)
                        handleDelete(img.name)
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => copyUrl(img.url)}
                    >
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
                    <p className="text-xs text-muted-foreground truncate">{img.name}</p>
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
          <p className="text-sm text-muted-foreground mb-2">Use these URLs in your content:</p>
          <code className="text-xs bg-muted p-2 rounded block">
            {STORAGE_BASE}{'{filename}'}
          </code>
        </CardContent>
      </Card>
    </div>
  )
}

// Crop Modal Component
function CropModal({
  open,
  onClose,
  imageFile,
  onCrop,
}: {
  open: boolean
  onClose: () => void
  imageFile: File | null
  onCrop: (file: File) => void
}) {
  const [crop, setCrop] = useState<Crop | undefined>(undefined)
  const imgRef = useRef<HTMLImageElement>(null)
  const [objUrl, setObjUrl] = useState<string | null>(null)

  // Create object URL when file changes
  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile)
      setObjUrl(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setObjUrl(null)
    }
  }, [imageFile])

  // Initialize crop when image loads
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    const size = Math.min(img.width, img.height) * 0.8
    setCrop({
      unit: 'px',
      x: (img.width - size) / 2,
      y: (img.height - size) / 2,
      width: size,
      height: size,
    })
  }

  const handleCropChange = (newCrop: Crop) => {
    setCrop(newCrop)
  }

  const handleConfirm = () => {
    const img = imgRef.current
    if (!img || !crop) return

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const scaleX = img.naturalWidth / img.width
    const scaleY = img.naturalHeight / img.height

    canvas.width = crop.width
    canvas.height = crop.height

    ctx.drawImage(
      img,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    )

    canvas.toBlob((blob) => {
      if (!blob) return
      const file = new File([blob], imageFile?.name || 'cropped.png', { type: 'image/png' })
      onCrop(file)
    }, 'image/png')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Crop Profile Image</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {objUrl && (
            <div className="flex justify-center bg-muted rounded-lg p-2 overflow-hidden">
              <ReactCrop
                crop={crop}
                onChange={handleCropChange}
                aspect={1}
                circularCrop
              >
                <img
                  ref={imgRef}
                  src={objUrl}
                  alt="Crop preview"
                  onLoad={handleImageLoad}
                  className="max-h-64 object-contain"
                />
              </ReactCrop>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleConfirm} disabled={!crop}>Apply Crop</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
