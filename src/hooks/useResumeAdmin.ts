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
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured')
    }

    const { error: fetchError } = await supabase
      .from('resume')
      .select('id')
      .eq('section', 'main')
      .single()

    if (fetchError?.code === 'PGRST116') {
      // Insert new
      const { error: insertError } = await supabase.from('resume').insert({ section: 'main', data: mainData })
      if (insertError) throw insertError
    } else {
      // Update existing
      const { data: existing, error: selectError } = await supabase
        .from('resume')
        .select('id')
        .eq('section', 'main')
        .single()

      if (selectError) throw selectError
      if (existing) {
        const { error: updateError } = await supabase
          .from('resume')
          .update({ data: mainData })
          .eq('id', existing.id)
        if (updateError) throw updateError
      }
    }

    setData((prev) => prev ? { ...prev, main: mainData } : null)
  }

  const saveResume = async (resumeData: ResumeDataJSON['resume']) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured')
    }

    const { data: existing, error: selectError } = await supabase
      .from('resume')
      .select('id')
      .eq('section', 'resume')
      .single()

    if (selectError) {
      console.error('Error fetching resume:', selectError)
      throw selectError
    }

    if (existing) {
      const { error: updateError } = await supabase
        .from('resume')
        .update({ data: resumeData })
        .eq('id', existing.id)

      if (updateError) {
        console.error('Error updating resume:', updateError)
        throw updateError
      }
    } else {
      const { error: insertError } = await supabase.from('resume').insert({ section: 'resume', data: resumeData })
      if (insertError) {
        console.error('Error inserting resume:', insertError)
        throw insertError
      }
    }

    setData((prev) => prev ? { ...prev, resume: resumeData } : null)
  }

  const savePortfolio = async (portfolioData: ResumeDataJSON['portfolio']) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured')
    }

    const { data: existing, error: selectError } = await supabase
      .from('resume')
      .select('id')
      .eq('section', 'portfolio')
      .single()

    if (selectError) throw selectError

    if (existing) {
      const { error: updateError } = await supabase
        .from('resume')
        .update({ data: portfolioData })
        .eq('id', existing.id)
      if (updateError) throw updateError
    } else {
      const { error: insertError } = await supabase.from('resume').insert({ section: 'portfolio', data: portfolioData })
      if (insertError) throw insertError
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
