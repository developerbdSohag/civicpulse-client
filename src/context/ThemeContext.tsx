'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check saved theme or system preference
    const saved = localStorage.getItem('civicpulse_theme') as Theme | null;
    const isDark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const activeTheme: Theme = isDark ? 'dark' : 'light';
    setTheme(activeTheme);
    document.documentElement.classList.toggle('dark', isDark);
    document.body.classList.toggle('dark', isDark);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('civicpulse_theme', nextTheme);
    const isDark = nextTheme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    document.body.classList.toggle('dark', isDark);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
