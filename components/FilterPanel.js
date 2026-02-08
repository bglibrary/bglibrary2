/**
 * Filter panel — optional filters. No domain logic; values passed from parent.
 */
export default function FilterPanel({ filters, onFiltersChange }) {
  if (!onFiltersChange) return null;
  return (
    <aside data-testid="filter-panel" style={{ marginBottom: "1rem" }}>
      <button type="button" onClick={() => onFiltersChange({})}>
        Effacer les filtres
      </button>
    </aside>
  );
}
