/**
 * Admin Game List — active and archived games.
 * @see specs/phase_7_4_ui_admin_game_list.md
 */
import { useState, useEffect } from "react";
import Link from "next/link";
import { createGameRepository } from "../../src/repository/GameRepository";
import { mapGameToCard } from "../../src/mapper/GameCardMapper";

const loadGames = () => [];
const defaultRepo = createGameRepository({ loadGames });

export default function AdminGameListPage() {
  const [state, setState] = useState({ status: "loading", games: [], error: null });
  const repo = defaultRepo;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const games = await repo.getAllGames("admin");
        if (!cancelled) {
          const cards = games.map((g) => ({ ...mapGameToCard(g), archived: g.archived }));
          setState({ status: "success", games: cards, error: null });
        }
      } catch (err) {
        if (!cancelled) setState({ status: "error", games: [], error: err });
      }
    })();
    return () => { cancelled = true; };
  }, [repo]);

  if (state.status === "loading") {
    return <div data-testid="admin-list-loading">Chargement…</div>;
  }
  if (state.status === "error") {
    return (
      <div data-testid="admin-list-error">
        Erreur : {state.error?.message ?? "Chargement impossible"}
      </div>
    );
  }

  return (
    <main data-testid="admin-game-list">
      <h1>Administration — Jeux</h1>
      <Link href="/admin/add-game">Ajouter un jeu</Link>
      {state.games.length === 0 ? (
        <p data-testid="admin-list-empty">Aucun jeu.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {state.games.map((card) => (
            <li key={card.id} data-archived={card.archived} style={{ margin: "0.5rem 0" }}>
              <Link href={`/admin/edit-game/${card.id}`}>{card.title}</Link>
              {card.archived ? <span> (archivé)</span> : null}
            </li>
          ))}
        </ul>
      )}
      <Link href="/">Retour accueil</Link>
    </main>
  );
}
