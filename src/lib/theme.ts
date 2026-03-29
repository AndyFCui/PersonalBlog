import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'dark' | 'light'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      setTheme: (theme) => {
        document.documentElement.setAttribute('data-theme', theme)
        set({ theme })
      },
      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark'
        document.documentElement.setAttribute('data-theme', newTheme)
        set({ theme: newTheme })
      },
    }),
    {
      name: 'theme-storage',
    }
  )
)

// Initialize theme on load
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('theme-storage')
  if (stored) {
    const { state } = JSON.parse(stored)
    if (state?.theme) {
      document.documentElement.setAttribute('data-theme', state.theme)
    }
  }
}
