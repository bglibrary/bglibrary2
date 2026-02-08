/**
 * Visitor Game Detail screen. Uses GameRepository.getGameById.
 * @see specs/phase_7_3_ui_visitor_game_detail.md
 */
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { createGameRepository } from "../../src/repository/GameRepository";

const loadGames = () => [];
const defaultRepo = createGameRepository({ loadGames });

export default function GameDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [state, setState] = useState({ status: "loading", game: null, error: null });
  const repo = defaultRepo;

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const game = await repo.getGameById(id, "visitor");
        if (!cancelled) setState({ status: "success", game, error: null });
      } catch (err) {
        if (!cancelled) {
          setState({ status: "error", game: null, error: err });
        }
      }
    })();
    return () => { cancelled = true; };
  }, [id, repo]);

  if (state.status === "loading") {
    return <div data-testid="game-detail-loading">Chargement…</div>;
  }
  if (state.status === "error") {
    const isNotFound = state.error?.code === "GAME_NOT_FOUND";
    const isArchived = state.error?.code === "GAME_ARCHIVED_NOT_VISIBLE";
    return (
      <div data-testid="game-detail-error">
        <p>{isNotFound ? "Jeu introuvable." : isArchived ? "Ce jeu n'est pas disponible." : state.error?.message}</p>
        <Link href="/">Retour à la bibliothèque</Link>
      </div>
    );
  }

  const g = state.game;
  return (
    <main data-testid="game-detail">
      <Link href="/">← Retour à la bibliothèque</Link>
      <h1>{g.title}</h1>
      {g.images?.[0] && (
        <figure>
          <img src={`/images/${g.images[0].id}`} alt={g.title} />
        </figure>
      )}
      <p><strong>Joueurs :</strong> {g.minPlayers}–{g.maxPlayers}</p>
      <p><strong>Durée :</strong> {g.playDuration}</p>
      <p><strong>Complexité première partie :</strong> {g.firstPlayComplexity}</p>
      {g.categories?.length > 0 && <p><strong>Catégories :</strong> {g.categories.join(", ")}</p>}
      {g.mechanics?.length > 0 && <p><strong>Mécaniques :</strong> {g.mechanics.join(", ")}</p>}
      <p>{g.description}</p>
    </main>
  );
}
