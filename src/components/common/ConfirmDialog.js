/**
 * ConfirmDialog Component
 * 
 * Modal confirmation dialog.
 * As specified in specs/UI_guidelines.md
 */

export default function ConfirmDialog({ title, message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-modal shadow-modal max-w-md w-full p-6">
        <h3 className="text-modal-title text-text-primary mb-4">
          {title}
        </h3>
        <p className="text-body text-text-secondary mb-6">
          {message}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2 px-4 rounded-button border border-border text-text-secondary hover:bg-cream transition-colors text-button"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 btn-primary"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}