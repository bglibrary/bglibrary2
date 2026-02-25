/**
 * SessionHistoryPanel Component
 * 
 * Side panel displaying pending session changes.
 * As specified in specs/phase_8_implementation_plan.md
 */

import { ActionType } from '@/admin/SessionHistory';

const ActionTypeIcons = {
  [ActionType.ADD_GAME]: '➕',
  [ActionType.UPDATE_GAME]: '✏️',
  [ActionType.ARCHIVE_GAME]: '📦',
  [ActionType.RESTORE_GAME]: '📤',
  [ActionType.TOGGLE_FAVORITE]: '❤️',
  [ActionType.DELETE_GAME]: '🗑️',
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
        <span className="text-lg">
          {ActionTypeIcons[action.type] || '📋'}
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
              onClick={() => onEdit(index)}
              className="p-1 rounded hover:bg-card dark:hover:bg-cream/10 transition-colors text-action"
              title="Modifier"
            >
              ✏️
            </button>
          )}
          <button
            onClick={() => onDelete(index)}
            className="p-1 rounded hover:bg-card dark:hover:bg-cream/10 transition-colors text-danger"
            title="Supprimer"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SessionHistoryPanel({ actions, onClearAll, onExport, onClose, onDeleteAction }) {
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
              onEdit={() => {}}
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