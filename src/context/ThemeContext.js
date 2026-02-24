/**
 * Theme Context
 * 
 * Provides theme management (light/dark mode) across the application.
 * Automatically detects OS theme preference and persists user choice.
 */

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(undefined);

const THEME_KEY = 'theme-preference';

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('system');
  const [resolvedTheme, setResolvedTheme] = useState('light');

  // Resolve the actual theme based on system preference
  const resolveTheme = (themeValue) => {
    if (themeValue === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return themeValue;
  };

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setTheme(savedTheme);
      setResolvedTheme(resolveTheme(savedTheme));
    } else {
      setTheme('system');
      setResolvedTheme(resolveTheme('system'));
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [resolvedTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      setResolvedTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Update theme preference
  const updateTheme = (newTheme) => {
    setTheme(newTheme);
    setResolvedTheme(resolveTheme(newTheme));
    localStorage.setItem(THEME_KEY, newTheme);
  };

  // Toggle between light and dark
  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    updateTheme(newTheme);
  };

  const value = {
    theme,
    resolvedTheme,
    setTheme: updateTheme,
    toggleTheme,
    isDark: resolvedTheme === 'dark',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}