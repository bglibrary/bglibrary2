/**
 * SessionHistoryPanel Component
 * 
 * Side panel displaying pending session changes.
 * As specified in specs/phase_8_implementation_plan.md
 */

import { ActionType } from '@/admin/SessionHistory';

// SVG Icons that adapt to theme via text-primary color
const ActionIcon = ({ type, className = '' }) => {
  const iconClass = `w-5 h-5 ${className}`;
  
  switch (type) {
    case ActionType.ADD_GAME:
      return (
        <svg className={iconClass} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      );
    case ActionType.UPDATE_GAME:
      return (
        <svg className={iconClass} viewBox="0 0 20 20" fill="currentColor">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
      );
    case ActionType.ARCHIVE_GAME:
      return (
        <svg className={iconClass} viewBox="0 0 20 20" fill="currentColor">
          <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
          <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      );
    case ActionType.RESTORE_GAME:
      return (
        <svg className={iconClass} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
        </svg>
      );
    case ActionType.TOGGLE_FAVORITE:
      return (
        <svg className={`${iconClass} text-favorite`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
      );
    case ActionType.DELETE_GAME:
      return (
        <svg className={`${iconClass} text-danger`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
    default:
      return (
        <svg className={iconClass} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      );
  }
};

function formatTimestamp(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'À l\'instant';
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  
  return date.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function ActionItem({ action, index, onEdit, onDelete }) {
  const canEdit = action.type === ActionType.ADD_GAME || action.type === ActionType.UPDATE_GAME;

  return (
    <div className="bg-cream dark:bg-card rounded-lg p-3 mb-2">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <span className="text-primary flex-shrink-0">
          <ActionIcon type={action.type} />
        </span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-body text-text-primary font-medium truncate">
            {action.summary}
          </p>
          <p className="text-meta text-text-muted">
            {formatTimestamp(action.timestamp)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {canEdit && (
            <button
              type="button"
              onClick={() => onEdit(index)}
              className="p-1.5 rounded hover:bg-card dark:hover:bg-cream/10 transition-colors text-action cursor-pointer"
              title="Modifier"
            >
              ✏️
            </button>
          )}
          <button
            type="button"
            onClick={() => onDelete(index)}
            className="p-1.5 rounded hover:bg-card dark:hover:bg-cream/10 transition-colors text-danger cursor-pointer"
            title="Supprimer"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SessionHistoryPanel({ actions, onClearAll, onExport, onClose, onDeleteAction, onEditAction }) {
  const hasChanges = actions && actions.length > 0;

  return (
    <aside className="fixed right-0 top-0 h-full w-80 bg-card border-l border-border shadow-lg z-40 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-section-title text-text-primary">
          Modifications
          {hasChanges && (
            <span className="ml-2 px-2 py-0.5 bg-primary text-white text-meta rounded-full">
              {actions.length}
            </span>
          )}
        </h2>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-cream dark:hover:bg-cream/10 transition-colors text-text-secondary"
          title="Fermer"
        >
          ✕
        </button>
      </div>

      {/* Actions list */}
      <div className="flex-1 overflow-y-auto p-4">
        {!hasChanges ? (
          <div className="text-center py-10">
            <p className="text-text-muted text-body">
              Aucune modification en attente.
            </p>
            <p className="text-meta text-text-muted mt-2">
              Les modifications apparaîtront ici.
            </p>
          </div>
        ) : (
          actions.map((action, index) => (
            <ActionItem
              key={action.id}
              action={action}
              index={index}
              onEdit={() => onEditAction && onEditAction(index, action)}
              onDelete={() => onDeleteAction && onDeleteAction(index)}
            />
          ))
        )}
      </div>

      {/* Footer actions */}
      {hasChanges && (
        <div className="p-4 border-t border-border space-y-2">
          <button
            onClick={onExport}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <span>📥</span>
            <span>Exporter le script</span>
          </button>
          <button
            onClick={onClearAll}
            className="w-full py-2 px-4 rounded-button border border-danger text-danger hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-button"
          >
            Effacer tout
          </button>
        </div>
      )}
    </aside>
  );
}