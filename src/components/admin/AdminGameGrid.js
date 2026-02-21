/**
 * AdminGameGrid Component
 * 
 * Grid of compact game cards with admin actions in overlay band.
 * Uses the shared AdminGameCard component.
 * As specified in specs/phase_7_4_ui_admin_game_list.md
 */

import { AdminGameCard } from '@/components/common/GameCard';

// Icon button for action band overlay
function ActionButton({ icon, title, onClick, href, className = '' }) {
  const baseClasses = 'p-1 rounded hover:bg-white/20 transition-colors text-white text-sm';
  
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

function AdminGameCardWithActions({ game, onToggleFavorite, onArchive, onRestore }) {
  return (
    <AdminGameCard game={game}>
      {/* Edit */}
      <ActionButton
        icon="✏️"
        title="Modifier"
        href={`/admin/edit-game/${game.id}`}
      />

      {/* Archive/Restore */}
      {game.isArchived ? (
        <ActionButton
          icon="📤"
          title="Restaurer"
          onClick={() => onRestore(game.id)}
        />
      ) : (
        <ActionButton
          icon="📦"
          title="Archiver"
          onClick={() => onArchive(game.id)}
        />
      )}

      {/* Favorite toggle */}
      <ActionButton
        icon={game.isFavorite ? '❤️' : '🤍'}
        title={game.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        onClick={() => onToggleFavorite(game.id)}
      />
    </AdminGameCard>
  );
}

export default function AdminGameGrid({ games, onToggleFavorite, onArchive, onRestore }) {
  if (!games || games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-text-secondary text-body">
          Aucun jeu trouvé.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {games.map(game => (
        <AdminGameCardWithActions
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