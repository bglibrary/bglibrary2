import fs from 'fs/promises';
import path from 'path';

export async function getGames() {
  const gamesDir = path.join(process.cwd(), 'data/games');
  console.log(`[getGames] Reading games from: ${gamesDir}`);
  try {
    const files = await fs.readdir(gamesDir);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    console.log(`[getGames] Found ${jsonFiles.length} JSON files: ${jsonFiles.join(', ')}`);
    
    const games = await Promise.all(
      jsonFiles.map(async file => {
        const content = await fs.readFile(path.join(gamesDir, file), 'utf8');
        const parsed = JSON.parse(content);
        console.log(`[getGames] Loaded game: ${parsed.id} ("${parsed.title}") - Archived: ${parsed.archived}`);
        return parsed;
      })
    );
    console.log(`[getGames] Total games loaded: ${games.length}`);
    return games;
  } catch (error) {
    console.error('[getGames] Error loading games:', error);
    return [];
  }
}
