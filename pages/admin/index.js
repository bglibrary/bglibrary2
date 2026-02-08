/**
 * Admin Game List — active and archived games. Archive/restore with confirmation.
 * @see specs/phase_7_4_ui_admin_game_list.md, phase_7_6_ui_admin_archive_management.md
 */
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createGameRepository } from "../../src/repository/GameRepository";
import { createAdminGameService } from "../../src/admin/AdminGameService";
import { getDefaultStore } from "../../src/admin/adminStore";
import { mapGameToCard } from "../../src/mapper/GameCardMapper";

const store = getDefaultStore();
const adminService = createAdminGameService(store);

function loadGames() {
  return store.getAllGames();
}

export default function AdminGameListPage() {
  const [state, setState] = useState({ status: "loading", games: [], error: null });
  const repoWithStore = createGameRepository({ loadGames });

  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, status: "loading" }));
    try {
      const games = await repoWithStore.getAllGames("admin");
      const cards = games.map((g) => ({ ...mapGameToCard(g), archived: g.archived }));
      setState({ status: "success", games: cards, error: null });
    } catch (err) {
      setState({ status: "error", games: [], error: err });
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const games = await repoWithStore.getAllGames("admin");
        if (!cancelled) {
          const cards = games.map((g) => ({ ...mapGameToCard(g), archived: g.archived }));
          setState({ status: "success", games: cards, error: null });
        }
      } catch (err) {
        if (!cancelled) setState({ status: "error", games: [], error: err });
      }
    })();
    return () => { cancelled = true; };
  }, [repoWithStore]);

  const handleArchive = async (id) => {
    if (typeof window !== "undefined" && !window.confirm("Archiver ce jeu ?")) return;
    setState((s) => ({ ...s, status: "loading" }));
    try {
      await adminService.archiveGame(id);
      await refresh();
    } catch (err) {
      setState((s) => ({ ...s, status: "error", error: err }));
    }
  };

  const handleRestore = async (id) => {
    if (typeof window !== "undefined" && !window.confirm("Restaurer ce jeu ?")) return;
    setState((s) => ({ ...s, status: "loading" }));
    try {
      await adminService.restoreGame(id);
      await refresh();
    } catch (err) {
      setState((s) => ({ ...s, status: "error", error: err }));
    }
  };

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
              {card.archived ? (
                <button type="button" onClick={() => handleRestore(card.id)}>Restaurer</button>
              ) : (
                <button type="button" onClick={() => handleArchive(card.id)}>Archiver</button>
              )}
            </li>
          ))}
        </ul>
      )}
      <Link href="/">Retour accueil</Link>
    </main>
  );
}
