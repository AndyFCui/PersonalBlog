/**
 * [INPUT]: 依赖 useState, useEffect, useRef, Link, ArrowLeft, Save, Button, useResumeAdmin, supabase
 * [OUTPUT]: 导出 AdminResumeEditor 组件
 * [POS]: resume-editor 模块的主容器，整合所有子组件
 * [PROTOCOL]: 变更时更新此头部，然后检查 src/pages/admin/CLAUDE.md
 */
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useResumeAdmin } from '@/hooks/useResumeAdmin'
import { supabase } from '@/lib/supabase'
import { deepClone, TABS } from './utils'
import type { ResumeDataJSON, MainData, ResumeData, PortfolioData } from '@/types/resume'
import { MainInfoEditor } from './MainInfoEditor'
import { ResumeEditor } from './ResumeEditor'
import { PortfolioEditor } from './PortfolioEditor'
import { ImageGallery } from './ImageGallery'

export function AdminResumeEditor() {
  const { data, loading, error, saveMain, saveResume, savePortfolio, saveAll, refresh } =
    useResumeAdmin()
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
    const dirty =
      JSON.stringify({ main: mainData, resume: resumeData, portfolio: portfolioData }) !==
      JSON.stringify({
        main: originalData.main,
        resume: originalData.resume,
        portfolio: originalData.portfolio,
      })
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
      if (
        !resumeToSave ||
        typeof resumeToSave !== 'object' ||
        resumeToSave instanceof Event ||
        resumeToSave instanceof HTMLElement
      ) {
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
          <Button onClick={refresh} className="mt-4">
            Retry
          </Button>
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
              {lastSaved && <span>Last saved: {lastSaved.toLocaleTimeString()}</span>}
              {isDirty && !saving && (
                <span className="text-yellow-500">• Unsaved changes</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {saved && <span className="text-sm text-green-500 font-medium">Saved!</span>}
            <Button
              onClick={() => handleSave(resumeData)}
              disabled={saving || !isDirty}
              className="shadow-lg"
            >
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
          <MainInfoEditor
            data={mainData}
            onChange={setMainData}
            onSave={() => saveMain(mainData)}
            saving={saving}
          />
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
          <PortfolioEditor
            data={portfolioData}
            onChange={setPortfolioData}
            onSave={() => savePortfolio(portfolioData)}
            saving={saving}
          />
        )}
        {activeTab === 'Images' && <ImageGallery />}
      </div>
    </div>
  )
}
