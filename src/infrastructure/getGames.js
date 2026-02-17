import fs from 'fs/promises';
import path from 'path';

/**
 * Loads all games from the data/games directory.
 * @returns {Promise<any[]>}
 */
export async function getGames() {
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
