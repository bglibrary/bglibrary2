/**
 * Visitor Game Library screen. Uses GameRepository, FilteringEngine, GameCardMapper.
 * @see specs/phase_7_2_ui_visitor_game_library.md
 */
import { useState, useEffect } from "react";
import Link from "next/link";
import GameCard from "./GameCard";
import FilterPanel from "./FilterPanel";
import { useMemo } from "react";
import { mapGameToCard } from "../src/mapper/GameCardMapper";
import { applySorting } from "../src/filtering/SortingEngine";
import { SORT_MODE_VALUES } from "../src/filtering/sortingTypes";

export default function GameLibrary({ gameRepository, applyFilters, context = "visitor" }) {
  const [state, setState] = useState({
    status: "loading",
    rawGames: [],
    error: null,
    filters: {},
    sortMode: "",
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setState((s) => ({ ...s, status: "loading" }));
      try {
        const games = await gameRepository.getAllGames(context);
        if (cancelled) return;
        setState((s) => ({ ...s, status: "success", rawGames: games, error: null }));
      } catch (err) {
        if (!cancelled) {
          setState((s) => ({ ...s, status: "error", rawGames: [], error: err }));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [gameRepository, context]);

  const filteredAndSortedCards = useMemo(() => {
    if (state.status !== "success") return [];
    try {
      const filtered = applyFilters(state.rawGames, state.filters);
      const sorted = applySorting(filtered, state.sortMode);
      return sorted.map((g) => mapGameToCard(g));
    } catch (err) {
      console.error("[GameLibrary] Filtering/Sorting error:", err);
      return [];
    }
  }, [state.rawGames, state.filters, state.sortMode, state.status, applyFilters]);

  const handleFiltersChange = (newFilters) => {
    setState((s) => ({ ...s, filters: newFilters }));
  };

  const handleSortChange = (newSortMode) => {
    if (newSortMode !== "" && !SORT_MODE_VALUES.includes(newSortMode)) {
      console.error("[GameLibrary] Invalid sort mode ignored:", newSortMode);
      return;
    }
    setState((s) => ({ ...s, sortMode: newSortMode }));
  };

  if (state.status === "loading") {
    return <div data-testid="game-library-loading">Chargement…</div>;
  }
  if (state.status === "error") {
    return (
      <div data-testid="game-library-error">
        Erreur : {state.error?.message ?? "Chargement impossible"}
      </div>
    );
  }

  return (
    <main data-testid="game-library">
      <h1>Bibliothèque de jeux</h1>
      <FilterPanel
        filters={state.filters}
        sortMode={state.sortMode}
        onFiltersChange={handleFiltersChange}
        onSortChange={handleSortChange}
      />
      {filteredAndSortedCards.length === 0 ? (
        <p data-testid="game-library-empty">Aucun jeu.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {filteredAndSortedCards.map((card) => (
            <li key={card.id}>
              <Link href={`/game/${card.id}`} passHref legacyBehavior>
                <a style={{ textDecoration: "none", color: "inherit" }}>
                  <GameCard card={card} />
                </a>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
