/**
 * Script to commit each imported game individually
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const GAMES_PATH = './data/games';
const PUBLIC_GAMES_PATH = './public/data/games';
const IMAGES_PATH = './public/images';

// Get all game files
const gameFiles = fs.readdirSync(GAMES_PATH).filter(f => f.endsWith('.json'));

// Skip existing games
const skipGames = ['azul', 'catan'];

for (const gameFile of gameFiles) {
  const gameId = gameFile.replace('.json', '');
  
  if (skipGames.includes(gameId)) {
    console.log(`Skipping existing game: ${gameId}`);
    continue;
  }
  
  // Read game title
  const gameData = JSON.parse(fs.readFileSync(path.join(GAMES_PATH, gameFile), 'utf-8'));
  const gameTitle = gameData.title;
  
  console.log(`Committing: ${gameTitle} (${gameId})`);
  
  // Build git add commands
  const filesToAdd = [
    path.join(GAMES_PATH, gameFile),
    path.join(PUBLIC_GAMES_PATH, gameFile)
  ];
  
  // Find and add image
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  for (const ext of imageExtensions) {
    const imagePath = path.join(IMAGES_PATH, `${gameId}-main.${ext}`);
    if (fs.existsSync(imagePath)) {
      filesToAdd.push(imagePath);
      break;
    }
  }
  
  // Git add
  for (const file of filesToAdd) {
    try {
      execSync(`git add "${file}"`, { stdio: 'inherit' });
    } catch (e) {
      // File might not exist or already staged
    }
  }
  
  // Git commit
  try {
    execSync(`git commit -m "Import game: ${gameTitle}"`, { stdio: 'inherit' });
  } catch (e) {
    console.log(`  (nothing to commit or already committed)`);
  }
  
  console.log('');
}

// Commit index.json
console.log('Committing index.json update...');
try {
  execSync('git add public/data/games/index.json', { stdio: 'inherit' });
  execSync('git commit -m "Update games index with imported games"', { stdio: 'inherit' });
} catch (e) {
  console.log('  (nothing to commit)');
}

console.log('\n✅ All games committed!');