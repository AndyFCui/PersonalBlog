import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'dark' | 'light'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  initializeTheme: () => void
}

// Singleton flag to prevent multiple initializations
let isInitialized = false

function getSystemTheme(): Theme {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'dark'
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      setTheme: (theme) => {
        document.documentElement.classList.remove('dark', 'light')
        document.documentElement.classList.add(theme)
        set({ theme })
      },
      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark'
        document.documentElement.classList.remove('dark', 'light')
        document.documentElement.classList.add(newTheme)
        set({ theme: newTheme })
      },
      initializeTheme: () => {
        // Prevent multiple initializations
        if (isInitialized || typeof window === 'undefined') {
          return
        }
        isInitialized = true

        const stored = localStorage.getItem('theme-storage')
        if (stored) {
          try {
            const { state } = JSON.parse(stored)
            if (state?.theme) {
              document.documentElement.classList.remove('dark', 'light')
              document.documentElement.classList.add(state.theme)
              return
            }
          } catch {
            // Invalid JSON, fall through to system theme
          }
        }
        // Follow system theme if no stored preference
        document.documentElement.classList.add(getSystemTheme())

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
          const stored = localStorage.getItem('theme-storage')
          if (!stored) {
            // Only auto-switch if user hasn't set a preference
            document.documentElement.classList.remove('dark', 'light')
            document.documentElement.classList.add(e.matches ? 'dark' : 'light')
          }
        })
      },
    }),
    {
      name: 'theme-storage',
    }
  )
)
