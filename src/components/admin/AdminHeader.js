/**
 * AdminHeader Component
 * 
 * Header for admin interface with search and actions.
 * As specified in specs/phase_7_4_ui_admin_game_list.md
 */

import Link from 'next/link';

export default function AdminHeader({ searchQuery, onSearchChange, onToggleHistory, historyCount }) {
  return (
    <header className="bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
        {/* Title */}
        <Link href="/" className="text-page-title text-text-primary hover:opacity-80 transition-opacity">
          Notre Ludothèque
        </Link>

        {/* Search bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Rechercher un jeu..."
              className="w-full pl-10 pr-4 py-2 rounded-button border border-border bg-white text-body focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Add Game button */}
          <Link
            href="/admin/add-game"
            className="btn-primary flex items-center gap-2"
          >
            <span>+</span>
            <span className="hidden sm:inline">Ajouter</span>
          </Link>

          {/* History toggle */}
          <button
            onClick={onToggleHistory}
            className="relative p-2 rounded-button border border-border bg-white hover:bg-cream transition-colors"
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