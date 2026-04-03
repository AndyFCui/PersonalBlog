import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { ResumeDataJSON } from '@/types/resume'

interface UseResumeAdminReturn {
  data: ResumeDataJSON | null
  loading: boolean
  error: string | null
  saveMain: (mainData: ResumeDataJSON['main']) => Promise<void>
  saveResume: (resumeData: ResumeDataJSON['resume']) => Promise<void>
  savePortfolio: (portfolioData: ResumeDataJSON['portfolio']) => Promise<void>
  saveAll: (data: ResumeDataJSON) => Promise<void>
  refresh: () => void
}

export function useResumeAdmin(): UseResumeAdminReturn {
  const [data, setData] = useState<ResumeDataJSON | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setError('Supabase not configured')
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const { data: resumeData, error: fetchError } = await supabase
        .from('resume')
        .select('section, data')

      if (fetchError) throw fetchError

      const result: ResumeDataJSON = {
        main: { name: '', occupation: '', description: '', image: '', intro: { role: '', company: '' }, bio: '', skills: [], contactmessage: '', email: '', phone: '', city: '', nameUnderImage: '', address: { street: '', city: '', state: '', zip: '' }, website: '', resumedownload: '', social: [] },
        resume: { skillmessage: '', education: [], work: [], skills: [] },
        portfolio: { projects: [] },
      }

      resumeData?.forEach((item) => {
        if (item.section === 'main') result.main = item.data
        if (item.section === 'resume') result.resume = item.data
        if (item.section === 'portfolio') result.portfolio = item.data
      })

      setData(result)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch resume data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const saveMain = async (mainData: ResumeDataJSON['main']) => {
    if (!isSupabaseConfigured()) return

    const { error: fetchError } = await supabase
      .from('resume')
      .select('id')
      .eq('section', 'main')
      .single()

    if (fetchError?.code === 'PGRST116') {
      // Insert new
      await supabase.from('resume').insert({ section: 'main', data: mainData })
    } else {
      // Update existing - need to get the id first
      const { data: existing } = await supabase
        .from('resume')
        .select('id')
        .eq('section', 'main')
        .single()

      if (existing) {
        await supabase
          .from('resume')
          .update({ data: mainData })
          .eq('id', existing.id)
      }
    }

    setData((prev) => prev ? { ...prev, main: mainData } : null)
  }

  const saveResume = async (resumeData: ResumeDataJSON['resume']) => {
    if (!isSupabaseConfigured()) return

    const { data: existing } = await supabase
      .from('resume')
      .select('id')
      .eq('section', 'resume')
      .single()

    if (existing) {
      await supabase
        .from('resume')
        .update({ data: resumeData })
        .eq('id', existing.id)
    } else {
      await supabase.from('resume').insert({ section: 'resume', data: resumeData })
    }

    setData((prev) => prev ? { ...prev, resume: resumeData } : null)
  }

  const savePortfolio = async (portfolioData: ResumeDataJSON['portfolio']) => {
    if (!isSupabaseConfigured()) return

    const { data: existing } = await supabase
      .from('resume')
      .select('id')
      .eq('section', 'portfolio')
      .single()

    if (existing) {
      await supabase
        .from('resume')
        .update({ data: portfolioData })
        .eq('id', existing.id)
    } else {
      await supabase.from('resume').insert({ section: 'portfolio', data: portfolioData })
    }

    setData((prev) => prev ? { ...prev, portfolio: portfolioData } : null)
  }

  const saveAll = async (allData: ResumeDataJSON) => {
    await saveMain(allData.main)
    await saveResume(allData.resume)
    await savePortfolio(allData.portfolio)
  }

  return { data, loading, error, saveMain, saveResume, savePortfolio, saveAll, refresh: fetchData }
}
