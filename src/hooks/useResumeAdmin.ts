import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { ResumeDataJSON } from '@/types/resume'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

/* ------------------------- 直接使用 fetch API ------------------------- */
async function fetchUpdate(table: string, id: string, data: any): Promise<void> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/resume?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({ data })
  })
  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Update failed: ${response.status} ${text}`)
  }
}

async function fetchSelect(table: string, section: string): Promise<{ id: string } | null> {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/resume?select=id&section=eq.${section}`,
    {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    }
  )
  const result = await response.json()
  return result[0] || null
}

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
        if (item.section === 'resume') {
          // Defensive: ensure work, education, skills are arrays
          result.resume = {
            skillmessage: item.data?.skillmessage || '',
            education: Array.isArray(item.data?.education) ? item.data.education : [],
            work: Array.isArray(item.data?.work) ? item.data.work : [],
            skills: Array.isArray(item.data?.skills) ? item.data.skills : [],
          }
        }
        if (item.section === 'portfolio') {
          result.portfolio = {
            projects: Array.isArray(item.data?.projects) ? item.data.projects : [],
          }
        }
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

    console.log('saveMain called, occupation:', mainData.occupation)

    const existing = await fetchSelect('resume', 'main')
    console.log('SELECT result:', existing)

    if (!existing) {
      // Insert new
      console.log('Inserting new main record')
      const response = await fetch(`${SUPABASE_URL}/rest/v1/resume`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ section: 'main', data: mainData })
      })
      if (!response.ok) {
        const text = await response.text()
        throw new Error(`Insert failed: ${response.status} ${text}`)
      }
    } else {
      // Update existing using fetch
      console.log('Updating main record, id:', existing.id)
      await fetchUpdate('resume', existing.id, mainData)
    }

    setData((prev) => prev ? { ...prev, main: mainData } : null)
  }

  const saveResume = async (resumeData: ResumeDataJSON['resume']) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured')
    }

    const existing = await fetchSelect('resume', 'resume')

    if (!existing) {
      // Insert new
      const response = await fetch(`${SUPABASE_URL}/rest/v1/resume`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ section: 'resume', data: resumeData })
      })
      if (!response.ok) {
        const text = await response.text()
        throw new Error(`Insert failed: ${response.status} ${text}`)
      }
    } else {
      // Update using fetch
      await fetchUpdate('resume', existing.id, resumeData)
    }

    setData((prev) => prev ? { ...prev, resume: resumeData } : null)
  }

  const savePortfolio = async (portfolioData: ResumeDataJSON['portfolio']) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured')
    }

    const existing = await fetchSelect('resume', 'portfolio')

    if (!existing) {
      // Insert new
      const response = await fetch(`${SUPABASE_URL}/rest/v1/resume`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ section: 'portfolio', data: portfolioData })
      })
      if (!response.ok) {
        const text = await response.text()
        throw new Error(`Insert failed: ${response.status} ${text}`)
      }
    } else {
      // Update using fetch
      await fetchUpdate('resume', existing.id, portfolioData)
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
