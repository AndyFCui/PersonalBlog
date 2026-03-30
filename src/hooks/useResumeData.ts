import { useState, useEffect } from 'react'
import type { ResumeDataJSON } from '@/types/resume'
import { validateResumeData, type ValidatedResumeData } from '@/lib/resume-schema'

interface UseResumeDataReturn {
  data: ResumeDataJSON | null
  loading: boolean
  error: string | null
}

export function useResumeData(): UseResumeDataReturn {
  const [data, setData] = useState<ResumeDataJSON | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timestamp = new Date().getTime()
        const response = await fetch(`/resumeData.json?v=${timestamp}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch resume data: ${response.statusText}`)
        }

        const jsonData = await response.json()

        // Validate the data structure
        const validatedData = validateResumeData(jsonData)

        if (!validatedData) {
          throw new Error('Invalid resume data structure')
        }

        setData(validatedData as ResumeDataJSON)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error loading resume data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}
