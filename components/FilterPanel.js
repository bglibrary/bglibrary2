/**
 * Filter panel — optional filters and sort mode. No domain logic; values passed from parent.
 */
export default function FilterPanel({ filters, sortMode, onFiltersChange, onSortChange }) {
  if (!onFiltersChange || !onSortChange) return null;
  return (
    <aside data-testid="filter-panel" style={{ marginBottom: "1rem" }}>
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="sort-mode" style={{ marginRight: "0.5rem" }}>Trier par :</label>
        <select
          id="sort-mode"
          data-testid="sort-select"
          value={sortMode || ""}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="">(Aucun tri)</option>
          <option value="PLAY_DURATION_ASC">Durée (croissante)</option>
          <option value="PLAY_DURATION_DESC">Durée (décroissante)</option>
          <option value="FIRST_PLAY_COMPLEXITY_ASC">Complexité (croissante)</option>
          <option value="FIRST_PLAY_COMPLEXITY_DESC">Complexité (décroissante)</option>
        </select>
      </div>
      <button type="button" onClick={() => onFiltersChange({})}>
        Effacer les filtres
      </button>
    </aside>
  );
}
