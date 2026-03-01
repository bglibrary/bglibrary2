/**
 * AdminGameGrid Component
 * 
 * Grid or list of compact game cards with admin actions.
 * Supports both grid and list view modes.
 * As specified in specs/phase_7_4_ui_admin_game_list.md
 */

import { useState } from 'react';
import { AdminGameCard } from '@/components/common/GameCard';

// SVG Icon components for consistent styling
// Archive: inbox tray emoji (putting in)
const ArchiveIcon = ({ className = '' }) => <span className={className}>📥</span>;

// Restore: outbox tray emoji (taking out)
const RestoreIcon = ({ className = '' }) => <span className={className}>📤</span>;

const EditIcon = ({ className = '' }) => (
  <svg className={`w-4 h-4 ${className}`} viewBox="0 0 20 20" fill="currentColor">
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
  </svg>
);

const HeartIcon = ({ filled = false, className = '' }) => (
  <svg className={`w-4 h-4 ${className}`} viewBox="0 0 20 20" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={filled ? 0 : 1.5}>
    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
  </svg>
);

// Icon button for action band overlay
function ActionButton({ icon, title, onClick, href, className = '' }) {
  const baseClasses = 'p-1.5 rounded hover:bg-white/20 transition-colors text-white';
  
  if (href) {
    return (
      <a
        href={href}
        className={`${baseClasses} ${className}`}
        title={title}
        onClick={(e) => e.stopPropagation()}
      >
        {icon}
      </a>
    );
  }
  
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick && onClick();
      }}
      className={`${baseClasses} ${className}`}
      title={title}
    >
      {icon}
    </button>
  );
}

// Grid card with overlay actions
function GridCard({ game, onToggleFavorite, onArchive, onRestore }) {
  return (
    <AdminGameCard game={game}>
      <ActionButton
        icon={<EditIcon />}
        title="Modifier"
        href={`/admin/edit-game/${game.id}`}
      />
      {game.isArchived ? (
        <ActionButton
          icon={<RestoreIcon />}
          title="Restaurer"
          onClick={() => onRestore(game.id)}
        />
      ) : (
        <ActionButton
          icon={<ArchiveIcon />}
          title="Archiver"
          onClick={() => onArchive(game.id)}
        />
      )}
      <ActionButton
        icon={<HeartIcon filled={game.isFavorite} className={game.isFavorite ? 'text-red-400' : ''} />}
        title={game.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        onClick={() => onToggleFavorite(game.id)}
      />
    </AdminGameCard>
  );
}

// List row with inline actions (simplified: title + actions only)
function ListRow({ game, onToggleFavorite, onArchive, onRestore }) {
  return (
    <div className={`flex items-center gap-4 p-3 bg-white rounded-lg border border-border ${game.isArchived ? 'opacity-60' : ''}`}>
      {/* Title */}
      <div className="flex-1 min-w-0">
        <h3 className="text-body text-text-primary font-medium truncate">
          {game.title}
          {game.isArchived && (
            <span className="text-meta text-text-muted ml-2">(archivé)</span>
          )}
        </h3>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <a
          href={`/admin/edit-game/${game.id}`}
          className="p-2 rounded-button hover:bg-cream transition-colors text-action"
          title="Modifier"
        >
          <EditIcon className="w-5 h-5" />
        </a>
        {game.isArchived ? (
          <button
            onClick={() => onRestore(game.id)}
            className="p-2 rounded-button hover:bg-cream transition-colors text-secondary"
            title="Restaurer"
          >
            <RestoreIcon className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={() => onArchive(game.id)}
            className="p-2 rounded-button hover:bg-cream transition-colors text-action"
            title="Archiver"
          >
            <ArchiveIcon className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={() => onToggleFavorite(game.id)}
          className={`p-2 rounded-button hover:bg-cream transition-colors ${
            game.isFavorite ? 'text-favorite' : 'text-action'
          }`}
          title={game.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <HeartIcon filled={game.isFavorite} className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default function AdminGameGrid({ 
  games, 
  onToggleFavorite, 
  onArchive, 
  onRestore,
  viewMode = 'grid',
  title = null,
  emptyMessage = 'Aucun jeu trouvé.',
  collapsible = false,
  defaultCollapsed = true
}) {
  const [isCollapsed, setIsCollapsed] = useState(collapsible ? defaultCollapsed : false);

  // Toggle collapse state
  const toggleCollapse = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

  // Render section with optional title
  const renderContent = () => {
    if (!games || games.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-text-secondary text-body">
            {emptyMessage}
          </p>
        </div>
      );
    }

    if (viewMode === 'list') {
      return (
        <div className="flex flex-col gap-2">
          {games.map(game => (
            <ListRow
              key={game.id}
              game={game}
              onToggleFavorite={onToggleFavorite}
              onArchive={onArchive}
              onRestore={onRestore}
            />
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {games.map(game => (
          <GridCard
            key={game.id}
            game={game}
            onToggleFavorite={onToggleFavorite}
            onArchive={onArchive}
            onRestore={onRestore}
          />
        ))}
      </div>
    );
  };

  // Chevron icon component
  const ChevronIcon = () => (
    <svg 
      className={`w-5 h-5 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`}
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  return (
    <div className="mb-8">
      {title && (
        <button
          onClick={toggleCollapse}
          className={`w-full flex items-center gap-2 mb-4 ${collapsible ? 'cursor-pointer hover:opacity-80 transition-opacity' : 'cursor-default'}`}
          disabled={!collapsible}
        >
          {collapsible && <ChevronIcon />}
          <h2 className="text-page-title font-semibold text-text-primary">{title}</h2>
          {collapsible && games && games.length > 0 && (
            <span className="text-meta text-text-muted ml-2">({games.length})</span>
          )}
        </button>
      )}
      {(!collapsible || !isCollapsed) && renderContent()}
    </div>
  );
}
