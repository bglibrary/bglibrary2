/**
 * Admin Add Game — full game form.
 * @see specs/phase_7_5_ui_admin_game_editor.md
 */
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { createAdminGameService } from "../../src/admin/AdminGameService";
import { PlayDuration, FirstPlayComplexity, AgeRange } from "../../src/domain/types";

function createInMemoryStore() {
  const games = [];
  return {
    getAllGames: async () => [...games],
    getGameById: async (id) => games.find((g) => g.id === id) ?? null,
    saveGame: async (game) => {
      const i = games.findIndex((g) => g.id === game.id);
      if (i >= 0) games[i] = game;
      else games.push(game);
    },
  };
}

const store = createInMemoryStore();
const adminService = createAdminGameService(store);

const defaultGame = {
  id: "",
  title: "",
  description: "",
  minPlayers: 2,
  maxPlayers: 4,
  playDuration: PlayDuration.MEDIUM,
  ageRecommendation: AgeRange.AGE_10_PLUS,
  firstPlayComplexity: FirstPlayComplexity.MEDIUM,
  categories: [],
  mechanics: [],
  awards: [],
  favorite: false,
  archived: false,
  images: [{ id: "img-1" }],
};

export default function AddGamePage() {
  const router = useRouter();
  const [form, setForm] = useState(defaultGame);
  const [status, setStatus] = useState({ type: "idle", error: null });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "submitting" });
    try {
      await adminService.addGame(form);
      router.push("/admin");
    } catch (err) {
      setStatus({ type: "error", error: err });
    }
  };

  return (
    <main data-testid="admin-add-game">
      <h1>Ajouter un jeu</h1>
      <Link href="/admin">← Liste</Link>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID</label>
          <input
            value={form.id}
            onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
            required
          />
        </div>
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
          <label>Complexité première partie</label>
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
