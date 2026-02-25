/**
 * Header Component
 * 
 * Main header for the application.
 * As specified in specs/UI_guidelines.md
 */

import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

// Theme toggle button component with colored SVG icons
function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-cream dark:hover:bg-cream/10 transition-colors"
      title={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
      aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
    >
      {isDark ? (
        // Sun icon (yellow/orange) for light mode
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 text-yellow-500" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          strokeWidth={2}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
          />
        </svg>
      ) : (
        // Moon icon (purple/blue) for dark mode
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 text-indigo-600" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          strokeWidth={2}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
          />
        </svg>
      )}
    </button>
  );
}

export default function Header({ title, showAdmin = false }) {
  return (
    <header className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-page-title text-text-primary">
          {title}
        </h1>
        
        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          {showAdmin && (
            <Link
              href="/admin"
              className="btn-primary"
            >
              Admin
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
