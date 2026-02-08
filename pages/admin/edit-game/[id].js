/**
 * Admin Edit Game — full game form.
 * @see specs/phase_7_5_ui_admin_game_editor.md
 */
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { createAdminGameService } from "../../../src/admin/AdminGameService";
import { createGameRepository } from "../../../src/repository/GameRepository";
import { getDefaultStore } from "../../../src/admin/adminStore";
import { PlayDuration, FirstPlayComplexity, AgeRange } from "../../../src/domain/types";

const store = getDefaultStore();
const adminService = createAdminGameService(store);
const repo = createGameRepository({ loadGames: () => store.getAllGames() });

export default function EditGamePage() {
  const router = useRouter();
  const { id } = router.query;
  const [form, setForm] = useState(null);
  const [status, setStatus] = useState({ type: "loading", error: null });

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const games = await repo.getAllGames("admin");
        const game = games.find((g) => g.id === id);
        if (!cancelled) {
          if (game) setForm({ ...game });
          else setStatus({ type: "error", error: new Error("Jeu introuvable") });
        }
      } catch (err) {
        if (!cancelled) setStatus({ type: "error", error: err });
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form) return;
    setStatus({ type: "submitting" });
    try {
      await adminService.updateGame(id, form);
      router.push("/admin");
    } catch (err) {
      setStatus({ type: "error", error: err });
    }
  };

  if (status.type === "loading" || !form) {
    return <div data-testid="admin-edit-loading">Chargement…</div>;
  }
  if (status.type === "error" && !form) {
    return <div data-testid="admin-edit-error">{status.error?.message}</div>;
  }

  return (
    <main data-testid="admin-edit-game">
      <h1>Modifier le jeu</h1>
      <Link href="/admin">← Liste</Link>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Titre</label>
          <input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            required
          />
        </div>
        <div>
          <label>Joueurs min</label>
          <input
            type="number"
            value={form.minPlayers}
            onChange={(e) => setForm((f) => ({ ...f, minPlayers: Number(e.target.value) }))}
          />
        </div>
        <div>
          <label>Joueurs max</label>
          <input
            type="number"
            value={form.maxPlayers}
            onChange={(e) => setForm((f) => ({ ...f, maxPlayers: Number(e.target.value) }))}
          />
        </div>
        <div>
          <label>Durée</label>
          <select
            value={form.playDuration}
            onChange={(e) => setForm((f) => ({ ...f, playDuration: e.target.value }))}
          >
            {Object.values(PlayDuration).map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Âge</label>
          <select
            value={form.ageRecommendation}
            onChange={(e) => setForm((f) => ({ ...f, ageRecommendation: e.target.value }))}
          >
            {Object.values(AgeRange).map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Complexité</label>
          <select
            value={form.firstPlayComplexity}
            onChange={(e) => setForm((f) => ({ ...f, firstPlayComplexity: e.target.value }))}
          >
            {Object.values(FirstPlayComplexity).map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
        {status.type === "error" && <p data-testid="form-error">{status.error?.message}</p>}
        <button type="submit" disabled={status.type === "submitting"}>
          {status.type === "submitting" ? "Envoi…" : "Enregistrer"}
        </button>
      </form>
    </main>
  );
}
