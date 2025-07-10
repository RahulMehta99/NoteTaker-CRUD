"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
  toggleTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  useEffect(() => {
    const root = window.document.documentElement
    const initialTheme = localStorage.getItem(storageKey) as Theme
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"

    const themeToApply = initialTheme || systemTheme
    setTheme(themeToApply)

    root.setAttribute("data-color-scheme", themeToApply)
    root.className = themeToApply
  }, [storageKey])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)

      const root = window.document.documentElement
      root.setAttribute("data-color-scheme", theme)
      root.className = theme
    },
    toggleTheme: () => {
      const newTheme = theme === "light" ? "dark" : "light"
      localStorage.setItem(storageKey, newTheme)
      setTheme(newTheme)

      const root = window.document.documentElement
      root.setAttribute("data-color-scheme", newTheme)
      root.className = newTheme
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
