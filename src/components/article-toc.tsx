import { useState, useEffect } from 'react'

interface TocItem {
  id: string
  text: string
  level: number
}

interface ArticleTocProps {
  content: string
}

export function ArticleToc({ content }: ArticleTocProps) {
  const [toc, setToc] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // Extract headings from markdown content
    const headingRegex = /^(#{1,6})\s+(.+)$/gm
    const items: TocItem[] = []
    const seenIds: Record<string, number> = {}
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const text = match[2].trim()
      let id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')

      // Handle duplicate IDs by adding suffix
      if (seenIds[id] !== undefined) {
        seenIds[id]++
        id = `${id}-${seenIds[id]}`
      } else {
        seenIds[id] = 0
      }

      items.push({ id, text, level })
    }

    setToc(items)
  }, [content])

  // Scroll spy effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0% -80% 0%' }
    )

    // Observe all heading elements
    toc.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [toc])

  if (toc.length === 0) return null

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <nav className="space-y-1">
      <h4 className="text-sm font-medium text-muted-foreground mb-3">Table of Contents</h4>
      {toc.map(({ id, text, level }) => (
        <button
          key={id}
          onClick={() => scrollToHeading(id)}
          className={`block text-left text-sm w-full py-1 transition-colors hover:text-primary ${
            level > 2 ? 'pl-4' : ''
          } ${activeId === id ? 'text-primary font-medium' : 'text-muted-foreground'}`}
          style={{ paddingLeft: `${(level - 1) * 12}px` }}
        >
          {text}
        </button>
      ))}
    </nav>
  )
}
