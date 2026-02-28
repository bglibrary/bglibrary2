/**
 * Import script for games-selection-gallery data
 * 
 * This script converts games from the games-selection-gallery repo
 * to the bglibrary format.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SOURCE_DB_PATH = '/tmp/games-selection-gallery/js/game_db.js';
const SOURCE_IMAGES_PATH = '/tmp/games-selection-gallery/img/games';
const TARGET_GAMES_PATH = './data/games';
const TARGET_PUBLIC_GAMES_PATH = './public/data/games';
const TARGET_IMAGES_PATH = './public/images';

// Category mapping (category_filter + type_filter -> categories)
const CATEGORY_MAPPING = {
  'bluff': 'Bluff',
  'cooperation': 'Coopératif',
  'battle': 'Affrontement',
  'memory': 'Mémoire',
  'luck': 'Chance',
  'speed': 'Rapidité',
  'guessing': 'Devinette',
  'observation': 'Observation',
  'fun': 'Ambiance',
  'management': 'Gestion',
  'adventure': 'Aventure',
  'fold': 'Plis',
  'optimisation': 'Stratégie',
  'cards': 'Jeu de cartes',
  'board': 'Jeu de plateau',
  'dice': 'Jeu de dés',
};

// Duration mapping
const DURATION_MAPPING = {
  'short': 'SHORT',
  'mid': 'MEDIUM',
  'long': 'LONG',
};

/**
 * Slugify a game title to create an ID
 */
function slugify(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '')    // Remove special chars
    .replace(/\s+/g, '-')            // Replace spaces with dashes
    .replace(/-+/g, '-')             // Remove consecutive dashes
    .replace(/^-|-$/g, '');          // Remove leading/trailing dashes
}

/**
 * Parse player count from string like "3 à 4" or "2-4 joueurs"
 */
function parsePlayerCount(playerNb) {
  const str = playerNb.toLowerCase().replace(/joueurs?/g, '').trim();
  
  // Handle "1 à 100" or "3 à 4"
  const rangeMatch = str.match(/(\d+)\s*(?:à|a|[-–])\s*(\d+)/);
  if (rangeMatch) {
    return { min: parseInt(rangeMatch[1]), max: parseInt(rangeMatch[2]) };
  }
  
  // Handle "2" (single number)
  const singleMatch = str.match(/^(\d+)$/);
  if (singleMatch) {
    const num = parseInt(singleMatch[1]);
    return { min: num, max: num };
  }
  
  // Default fallback
  return { min: 2, max: 4 };
}

/**
 * Parse duration filter to PlayDuration enum
 */
function parseDuration(durationFilter) {
  if (!durationFilter) return 'MEDIUM';
  
  const filters = durationFilter.split(',');
  // Take the first valid duration
  for (const f of filters) {
    const trimmed = f.trim();
    if (DURATION_MAPPING[trimmed]) {
      return DURATION_MAPPING[trimmed];
    }
  }
  return 'MEDIUM';
}

/**
 * Determine first play complexity based on type_filter
 */
function parseComplexity(typeFilter) {
  if (!typeFilter) return 'MEDIUM';
  
  if (typeFilter.includes('fast_rules')) {
    return 'LOW';
  }
  return 'MEDIUM';
}

/**
 * Map category_filter and type_filter to categories array
 */
function mapCategories(categoryFilter, typeFilter) {
  const categories = new Set();
  
  // Process category_filter
  if (categoryFilter) {
    const filters = categoryFilter.split(',');
    for (const f of filters) {
      const trimmed = f.trim();
      if (CATEGORY_MAPPING[trimmed]) {
        categories.add(CATEGORY_MAPPING[trimmed]);
      }
    }
  }
  
  // Process type_filter
  if (typeFilter) {
    const filters = typeFilter.split(',');
    for (const f of filters) {
      const trimmed = f.trim();
      if (CATEGORY_MAPPING[trimmed]) {
        categories.add(CATEGORY_MAPPING[trimmed]);
      }
    }
  }
  
  return Array.from(categories);
}

/**
 * Get image extension from filename
 */
function getImageExtension(filename) {
  return path.extname(filename).toLowerCase();
}

/**
 * Convert a source game to target format
 */
function convertGame(sourceGame) {
  const id = slugify(sourceGame.title);
  const playerCount = parsePlayerCount(sourceGame.player_nb);
  const categories = mapCategories(sourceGame.category_filter, sourceGame.type_filter);
  
  // Get image info
  const imageFilename = path.basename(sourceGame.image || '');
  const imageExt = getImageExtension(imageFilename);
  
  const targetGame = {
    id: id,
    title: sourceGame.title,
    description: sourceGame.goal || '',
    minPlayers: playerCount.min,
    maxPlayers: playerCount.max,
    playDuration: parseDuration(sourceGame.duration_filter),
    ageRecommendation: '10+',
    firstPlayComplexity: parseComplexity(sourceGame.type_filter),
    categories: categories,
    mechanics: [],
    awards: [],
    favorite: false,
    archived: false,
    images: imageFilename ? [
      { 
        id: `${id}-main`, 
        source: 'import', 
        attribution: '' 
      }
    ] : []
  };
  
  return {
    game: targetGame,
    sourceImage: imageFilename,
    targetImageName: `${id}-main${imageExt}`
  };
}

/**
 * Main import function
 */
async function main() {
  console.log('🎮 Starting game import...\n');
  
  // Read source database
  const sourceContent = fs.readFileSync(SOURCE_DB_PATH, 'utf-8');
  
  // Extract games_db array from JS file
  const match = sourceContent.match(/const games_db\s*=\s*(\[[\s\S]*?\]);/);
  if (!match) {
    console.error('Could not parse games_db from source file');
    process.exit(1);
  }
  
  // Evaluate the array (safe since it's just data)
  const sourceGames = eval(match[1]);
  console.log(`Found ${sourceGames.length} games to import\n`);
  
  // Ensure target directories exist
  fs.mkdirSync(TARGET_GAMES_PATH, { recursive: true });
  fs.mkdirSync(TARGET_PUBLIC_GAMES_PATH, { recursive: true });
  fs.mkdirSync(TARGET_IMAGES_PATH, { recursive: true });
  
  const importedGames = [];
  const indexEntries = [];
  
  for (const sourceGame of sourceGames) {
    const result = convertGame(sourceGame);
    const { game, sourceImage, targetImageName } = result;
    
    console.log(`Processing: ${game.title} (${game.id})`);
    
    // Write game JSON to data/games/
    const gameJsonPath = path.join(TARGET_GAMES_PATH, `${game.id}.json`);
    fs.writeFileSync(gameJsonPath, JSON.stringify(game, null, 2));
    
    // Write game JSON to public/data/games/
    const publicGameJsonPath = path.join(TARGET_PUBLIC_GAMES_PATH, `${game.id}.json`);
    fs.writeFileSync(publicGameJsonPath, JSON.stringify(game, null, 2));
    
    // Copy image if exists
    if (sourceImage) {
      const sourceImagePath = path.join(SOURCE_IMAGES_PATH, sourceImage);
      const targetImagePath = path.join(TARGET_IMAGES_PATH, targetImageName);
      
      if (fs.existsSync(sourceImagePath)) {
        fs.copyFileSync(sourceImagePath, targetImagePath);
        console.log(`  ✓ Image copied: ${targetImageName}`);
      } else {
        console.log(`  ⚠ Image not found: ${sourceImage}`);
      }
    }
    
    // Add to index
    indexEntries.push({
      id: game.id,
      title: game.title,
      minPlayers: game.minPlayers,
      maxPlayers: game.maxPlayers,
      playDuration: game.playDuration,
      categories: game.categories,
      favorite: game.favorite,
      archived: game.archived,
      hasAwards: game.awards.length > 0,
      images: game.images
    });
    
    importedGames.push(game);
    console.log('');
  }
  
  // Write index.json
  const indexPath = path.join(TARGET_PUBLIC_GAMES_PATH, 'index.json');
  fs.writeFileSync(indexPath, JSON.stringify(indexEntries, null, 2));
  console.log(`✓ Updated index.json with ${indexEntries.length} games\n`);
  
  console.log('🎉 Import complete!');
  console.log(`   - ${importedGames.length} games imported`);
  console.log(`   - Files written to: ${TARGET_GAMES_PATH}`);
  console.log(`   - Images copied to: ${TARGET_IMAGES_PATH}`);
}

main().catch(console.error);