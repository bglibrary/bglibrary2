import path from 'path';
import { promises as fs } from 'fs';
import { createGameRepository } from "../repository/GameRepository";

// We need a simple data loading function that GameRepository can use.
// This function will directly read from the filesystem.
async function loadGamesFromFileSystem() {
  const gamesDir = path.join(process.cwd(), 'data/games');
  try {
    const files = await fs.readdir(gamesDir);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    
    const games = await Promise.all(
      jsonFiles.map(async file => {
        const content = await fs.readFile(path.join(gamesDir, file), 'utf8');
        return JSON.parse(content);
      })
    );
    return games;
  } catch (error) {
    console.error('Error loading games from filesystem:', error);
    return [];
  }
}

// Create a singleton instance of the GameRepository using the file system loader.
// This ensures that all parts of the application use the same repository instance
// and its enforced visibility rules.
const gameRepository = createGameRepository({ loadGames: loadGamesFromFileSystem });

/**
 * Public function to get games for the visitor context.
 * This function should be used by client-side pages (e.g., pages/index.js) via getStaticProps.
 * @returns {Promise<import("../domain/Game").Game[]>}
 */
export async function getGamesForVisitor() {
  return gameRepository.getAllGames("visitor");
}

/**
 * Public function to get games for the admin context.
 * This function should be used by admin-side pages or API routes.
 * @returns {Promise<import("../domain/Game").Game[]>}
 */
export async function getGamesForAdmin() {
  return gameRepository.getAllGames("admin");
}
