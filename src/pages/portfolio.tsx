import { useResumeData } from '@/hooks/useResumeData'
import { Header, About, Experience, Education, Portfolio, Footer } from '@/components/sections'

export function PortfolioPage() {
  const { data, loading, error } = useResumeData()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-foreground/60">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-destructive mb-2">Error: {error}</p>
          <p className="text-foreground/60">Please refresh the page or try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <div id="main-content" className="min-h-screen bg-background">
      <Header data={data?.main || null} />
      <About data={data?.main || null} />
      <Experience data={data?.resume || null} />
      <Education data={data?.resume || null} />
      <Portfolio data={data?.portfolio || null} />
      <Footer data={data?.main || null} />
    </div>
  )
}
