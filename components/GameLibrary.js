/**
 * Visitor Game Library screen. Uses GameRepository, FilteringEngine, GameCardMapper.
 * @see specs/phase_7_2_ui_visitor_game_library.md
 */
import { useState, useEffect } from "react";
import Link from "next/link";
import GameCard from "./GameCard";
import FilterPanel from "./FilterPanel";
import { mapGameToCard } from "../src/mapper/GameCardMapper";

export default function GameLibrary({ gameRepository, applyFilters, context = "visitor" }) {
  const [state, setState] = useState({ status: "loading", games: [], error: null, filters: {} });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const games = await gameRepository.getAllGames(context);
        if (cancelled) return;
        const filtered = applyFilters(games, {});
        const cards = filtered.map((g) => mapGameToCard(g));
        setState({ status: "success", games: cards, error: null, filters: {} });
      } catch (err) {
        if (!cancelled) {
          setState({ status: "error", games: [], error: err, filters: {} });
        }
      }
    })();
    return () => { cancelled = true; };
  }, [gameRepository, context]);

  const handleFiltersChange = async (newFilters) => {
    setState((s) => ({ ...s, status: "loading" }));
    try {
      const games = await gameRepository.getAllGames(context);
      const filtered = applyFilters(games, newFilters);
      const cards = filtered.map((g) => mapGameToCard(g));
      setState((s) => ({ ...s, status: "success", games: cards, filters: newFilters }));
    } catch (err) {
      setState((s) => ({ ...s, status: "error", error: err, games: [] }));
    }
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
      <FilterPanel filters={state.filters} onFiltersChange={handleFiltersChange} />
      {state.games.length === 0 ? (
        <p data-testid="game-library-empty">Aucun jeu.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {state.games.map((card) => (
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
