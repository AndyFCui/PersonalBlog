import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { ResumeDataJSON } from '@/types/resume'

interface UseSupabaseResumeDataReturn {
  data: ResumeDataJSON | null
  loading: boolean
  error: string | null
}

export function useSupabaseResumeData(): UseSupabaseResumeDataReturn {
  const [data, setData] = useState<ResumeDataJSON | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResumeData = async () => {
      // Fallback to local JSON if Supabase not configured
      if (!isSupabaseConfigured()) {
        try {
          const response = await fetch(`/resumeData.json?v=${Date.now()}`)
          if (response.ok) {
            const jsonData = await response.json()
            setData(jsonData)
          }
        } catch {
          // Ignore fallback errors
        }
        setLoading(false)
        return
      }

      try {
        const [mainResult, resumeResult, portfolioResult] = await Promise.all([
          supabase.from('resume').select('data').eq('section', 'main').single(),
          supabase.from('resume').select('data').eq('section', 'resume').single(),
          supabase.from('resume').select('data').eq('section', 'portfolio').single(),
        ])

        if (mainResult.error) throw mainResult.error
        if (resumeResult.error) throw resumeResult.error
        if (portfolioResult.error) throw portfolioResult.error

        const combinedData: ResumeDataJSON = {
          main: mainResult.data?.data || {},
          resume: resumeResult.data?.data || { skillmessage: '', education: [], work: [], skills: [] },
          portfolio: portfolioResult.data?.data || { projects: [] },
        }

        setData(combinedData)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch resume data')
        console.error('Error fetching resume data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchResumeData()
  }, [])

  return { data, loading, error }
}
