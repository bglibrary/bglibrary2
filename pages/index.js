import GameLibrary from "../components/GameLibrary";
import { createGameRepository } from "../src/repository/GameRepository";
import { applyFilters } from "../src/filtering/FilteringEngine";

const loadGames = () => [];
const repo = createGameRepository({ loadGames });

export default function Home() {
  return (
    <GameLibrary
      gameRepository={repo}
      applyFilters={applyFilters}
      context="visitor"
    />
  );
}
