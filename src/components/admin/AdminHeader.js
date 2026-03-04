/**
 * AdminHeader Component
 * 
 * Header for admin interface with search, view toggle, and actions.
 * As specified in specs/phase_7_4_ui_admin_game_list.md
 */

import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import SearchBar from '@/components/common/SearchBar';

// Theme toggle button component with colored SVG icons
function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-button border border-border bg-card hover:bg-cream dark:hover:bg-cream/10 transition-colors"
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

export default function AdminHeader({ 
  searchQuery, 
  onSearchChange, 
  onToggleHistory, 
  historyCount,
  viewMode,
  onViewModeChange 
}) {
  return (
    <header className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
        {/* Title */}
        <Link href="/" className="text-page-title text-text-primary hover:opacity-80 transition-opacity">
          Notre Ludothèque
        </Link>

        {/* Search bar */}
        <div className="flex-1 max-w-md">
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Rechercher un jeu..."
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* View mode toggle */}
          <div className="flex items-center border border-border rounded-button overflow-hidden">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`px-3 py-2 transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-primary text-white' 
                  : 'bg-card text-text-primary hover:bg-cream dark:hover:bg-cream/10'
              }`}
              title="Vue grille"
            >
              ⊞
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`px-3 py-2 transition-colors ${
                viewMode === 'list' 
                  ? 'bg-primary text-white' 
                  : 'bg-card text-text-primary hover:bg-cream dark:hover:bg-cream/10'
              }`}
              title="Vue liste"
            >
              ☰
            </button>
          </div>

          {/* Add Game button */}
          <Link
            href="/admin/add-game"
            className="btn-primary flex items-center gap-2"
          >
            <span>+</span>
            <span className="hidden sm:inline">Ajouter</span>
          </Link>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* History toggle */}
          <button
            onClick={onToggleHistory}
            className="relative p-2 rounded-button border border-border bg-card hover:bg-cream dark:hover:bg-cream/10 transition-colors"
            title="Historique de session"
          >
            📋
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                {historyCount > 9 ? '9+' : historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
