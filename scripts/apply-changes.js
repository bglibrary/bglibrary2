#!/usr/bin/env node
/**
 * Script to apply session changes to the file system
 * 
 * This script reads a session history JSON file and applies all changes:
 * - ADD_GAME: Create new game JSON file + image
 * - UPDATE_GAME: Update existing game JSON file + image
 * - ARCHIVE_GAME: Mark game as archived
 * - RESTORE_GAME: Mark game as not archived
 * - TOGGLE_FAVORITE: Toggle favorite status
 * - DELETE_GAME: Remove game JSON file + image
 * 
 * Workflow:
 * 1. Creates a new branch for the changes
 * 2. Applies all pending actions (one commit per action)
 * 3. Asks for validation before rebasing on main
 * 4. Asks for validation before merging on main
 * 5. Deletes the session JSON file
 * 
 * Usage: node scripts/apply-changes.js <session-history.json> [--dry-run] [--no-commit]
 * 
 * Options:
 *   --dry-run     Preview changes without applying
 *   --no-commit   Apply changes without Git workflow (for testing)
 *   --help        Show this help message
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

// Paths
const PUBLIC_GAMES_PATH = './public/data/games';
const PUBLIC_IMAGES_PATH = './public/images';
const INDEX_PATH = './public/data/games/index.json';
const BRANCH_PREFIX = 'admin-session';

// Action type constants (must match SessionHistory.js)
const ActionType = {
  ADD_GAME: 'ADD_GAME',
  UPDATE_GAME: 'UPDATE_GAME',
  ARCHIVE_GAME: 'ARCHIVE_GAME',
  RESTORE_GAME: 'RESTORE_GAME',
  TOGGLE_FAVORITE: 'TOGGLE_FAVORITE',
  DELETE_GAME: 'DELETE_GAME',
};

// Action labels for commit messages
const ActionLabels = {
  [ActionType.ADD_GAME]: 'Add game',
  [ActionType.UPDATE_GAME]: 'Update game',
  [ActionType.ARCHIVE_GAME]: 'Archive game',
  [ActionType.RESTORE_GAME]: 'Restore game',
  [ActionType.TOGGLE_FAVORITE]: 'Toggle favorite',
  [ActionType.DELETE_GAME]: 'Delete game',
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Create a readline interface for user input
 */
function createReadlineInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

/**
 * Ask user for confirmation
 * @param {string} prompt - Question to ask
 * @param {boolean} defaultYes - Default answer (true = Y, false = N)
 * @returns {Promise<boolean>}
 */
function askConfirmation(prompt, defaultYes = false) {
  return new Promise((resolve) => {
    const rl = createReadlineInterface();
    const hint = defaultYes ? '[Y/n]' : '[y/N]';
    
    rl.question(`\n${prompt} ${hint}: `, (answer) => {
      rl.close();
      
      if (!answer.trim()) {
        resolve(defaultYes);
        return;
      }
      
      const lower = answer.trim().toLowerCase();
      resolve(['y', 'yes', 'o', 'oui'].includes(lower));
    });
  });
}

/**
 * Execute a git command
 * @param {string} command - Git command (without 'git' prefix)
 * @param {Object} options - Execution options
 * @returns {string} Command output
 */
function git(command, options = { stdio: 'pipe' }) {
  try {
    const result = execSync(`git ${command}`, options);
    // execSync can return null if the command produces no output
    if (result === null || result === undefined) {
      return '';
    }
    return result.toString().trim();
  } catch (error) {
    if (options.stdio === 'inherit') {
      throw error;
    }
    return '';
  }
}

/**
 * Get current git branch name
 * @returns {string}
 */
function getCurrentBranch() {
  return git('branch --show-current');
}

/**
 * Check if there are uncommitted changes (excluding the session file)
 * @param {string} sessionFile - The session file to exclude
 * @returns {boolean}
 */
function hasUncommittedChanges(sessionFile) {
  const status = git('status --porcelain');
  if (!status) return false;
  
  // Filter out the session file itself - it's expected to be untracked
  const lines = status.split('\n').filter(l => l.trim());
  const otherChanges = lines.filter(line => {
    // Extract filename from git status output (format: "XY filename")
    const parts = line.trim().split(' ');
    const file = parts[parts.length - 1];
    // Ignore the session file
    return file !== sessionFile && file !== path.basename(sessionFile);
  });
  
  return otherChanges.length > 0;
}

// ============================================================================
// File Operations
// ============================================================================

/**
 * Read existing game JSON file
 * @param {string} gameId 
 * @returns {object|null}
 */
function readGameFile(gameId) {
  const filePath = path.join(PUBLIC_GAMES_PATH, `${gameId}.json`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

/**
 * Write game JSON file
 * @param {string} gameId 
 * @param {object} gameData 
 */
function writeGameFile(gameId, gameData) {
  const filePath = path.join(PUBLIC_GAMES_PATH, `${gameId}.json`);
  
  // Clean up internal fields before writing
  const cleanData = { ...gameData };
  delete cleanData._imageData;
  
  fs.writeFileSync(filePath, JSON.stringify(cleanData, null, 2) + '\n');
}

/**
 * Delete game JSON file
 * @param {string} gameId 
 * @returns {boolean}
 */
function deleteGameFile(gameId) {
  const filePath = path.join(PUBLIC_GAMES_PATH, `${gameId}.json`);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  return false;
}

/**
 * Save image from base64 data
 * @param {string} gameId 
 * @param {object} imageData - { base64, type, filename }
 * @returns {string|null} Image filename or null
 */
function saveImage(gameId, imageData) {
  if (!imageData || !imageData.base64) {
    return null;
  }

  try {
    // Extract base64 data (remove data:image/xxx;base64, prefix)
    const matches = imageData.base64.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) {
      console.log('  ⚠ Invalid base64 image format');
      return null;
    }

    const ext = matches[1]; // jpeg, png, webp, etc.
    const base64Data = matches[2];
    
    // Determine file extension
    const extension = ext === 'jpeg' ? 'jpg' : ext;
    const filename = `${gameId}-main.${extension}`;
    const filePath = path.join(PUBLIC_IMAGES_PATH, filename);
    
    // Convert base64 to buffer and write
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(filePath, buffer);
    
    console.log(`  ✓ Saved image: ${filename}`);
    return filename;
  } catch (error) {
    console.log(`  ⚠ Failed to save image: ${error.message}`);
    return null;
  }
}

/**
 * Delete game image
 * @param {string} gameId 
 * @returns {boolean}
 */
function deleteGameImage(gameId) {
  const extensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
  
  for (const ext of extensions) {
    const filePath = path.join(PUBLIC_IMAGES_PATH, `${gameId}-main.${ext}`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`  ✓ Deleted image: ${gameId}-main.${ext}`);
      return true;
    }
  }
  return false;
}

/**
 * Update index.json
 * 
 * Maintains the original format: { "games": ["game-id-1", "game-id-2", ...] }
 */
function updateIndex() {
  const indexPath = path.join(INDEX_PATH);
  
  // Get all game files
  const gameFiles = fs.readdirSync(PUBLIC_GAMES_PATH)
    .filter(f => f.endsWith('.json') && f !== 'index.json');
  
  // Build list of game IDs
  const gameIds = [];
  for (const gameFile of gameFiles) {
    const gameId = gameFile.replace('.json', '');
    const gameData = readGameFile(gameId);
    if (gameData) {
      gameIds.push(gameId);
    }
  }
  
  // Sort alphabetically
  gameIds.sort((a, b) => a.localeCompare(b, 'fr'));
  
  // Write index in original format
  const index = { games: gameIds };
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n');
}

// ============================================================================
// Git Operations
// ============================================================================

/**
 * Create a new session branch
 * @returns {string} Branch name
 */
function createSessionBranch() {
  const timestamp = new Date().toISOString()
    .replace(/[-:T]/g, '')
    .replace(/\..+/, '')
    .slice(0, 15); // YYYYMMDDTHHMMSS
  const branchName = `${BRANCH_PREFIX}-${timestamp}`;
  
  git(`checkout -b ${branchName}`, { stdio: 'inherit' });
  return branchName;
}

/**
 * Stage and commit files
 * @param {string[]} files - Files to commit
 * @param {string} message - Commit message
 */
function commitFiles(files, message) {
  for (const file of files) {
    if (fs.existsSync(file)) {
      git(`add "${file}"`, { stdio: 'pipe' });
    } else {
      // File might be deleted, stage the deletion
      git(`add -A "${file}"`, { stdio: 'pipe' });
    }
  }
  
  git(`commit -m "${message}"`, { stdio: 'inherit' });
}

/**
 * Merge session branch to main
 * @param {string} branchName 
 */
function mergeToMain(branchName) {
  git('checkout main', { stdio: 'inherit' });
  git(`merge ${branchName} --no-ff -m "Merge branch '${branchName}' - Admin session update"`, { stdio: 'inherit' });
  git(`branch -d ${branchName}`, { stdio: 'pipe' });
}

/**
 * Push to remote
 */
function pushToRemote() {
  git('push', { stdio: 'inherit' });
}

// ============================================================================
// Action Handlers
// ============================================================================

/**
 * Apply ADD_GAME action
 * @param {object} action 
 * @param {boolean} dryRun 
 * @returns {string[]} Files affected
 */
function applyAddGame(action, dryRun) {
  const { gameId, payload } = action;
  const files = [];
  
  if (!payload) {
    console.log('  ⚠ No payload for ADD_GAME');
    return files;
  }
  
  if (dryRun) {
    console.log(`  Would create: ${gameId}.json`);
    if (payload._imageData) {
      console.log(`  Would save image for: ${gameId}`);
    }
    return files;
  }
  
  // Save image if present
  if (payload._imageData) {
    const imageFilename = saveImage(gameId, payload._imageData);
    if (imageFilename) {
      payload.images = [{ id: `${gameId}-main` }];
      files.push(path.join(PUBLIC_IMAGES_PATH, imageFilename));
    }
  }
  
  // Write game file
  writeGameFile(gameId, payload);
  files.push(path.join(PUBLIC_GAMES_PATH, `${gameId}.json`));
  console.log(`  ✓ Created: ${gameId}.json`);
  
  return files;
}

/**
 * Apply UPDATE_GAME action
 * @param {object} action 
 * @param {boolean} dryRun 
 * @returns {string[]} Files affected
 */
function applyUpdateGame(action, dryRun) {
  const { gameId, payload } = action;
  const files = [];
  
  if (!payload) {
    console.log('  ⚠ No payload for UPDATE_GAME');
    return files;
  }
  
  if (dryRun) {
    console.log(`  Would update: ${gameId}.json`);
    if (payload._imageData) {
      console.log(`  Would update image for: ${gameId}`);
    }
    return files;
  }
  
  // Get existing game data
  const existing = readGameFile(gameId) || {};
  
  // Save new image if present
  if (payload._imageData) {
    // Delete old image first
    deleteGameImage(gameId);
    
    const imageFilename = saveImage(gameId, payload._imageData);
    if (imageFilename) {
      payload.images = [{ id: `${gameId}-main` }];
      files.push(path.join(PUBLIC_IMAGES_PATH, imageFilename));
    }
  }
  
  // Merge with existing data
  const updated = { ...existing, ...payload };
  writeGameFile(gameId, updated);
  files.push(path.join(PUBLIC_GAMES_PATH, `${gameId}.json`));
  console.log(`  ✓ Updated: ${gameId}.json`);
  
  return files;
}

/**
 * Apply ARCHIVE_GAME action
 * @param {object} action 
 * @param {boolean} dryRun 
 * @returns {string[]} Files affected
 */
function applyArchiveGame(action, dryRun) {
  const { gameId } = action;
  const files = [];
  
  if (dryRun) {
    console.log(`  Would archive: ${gameId}`);
    return files;
  }
  
  const game = readGameFile(gameId);
  if (!game) {
    console.log(`  ⚠ Game not found: ${gameId}`);
    return files;
  }
  
  game.archived = true;
  writeGameFile(gameId, game);
  files.push(path.join(PUBLIC_GAMES_PATH, `${gameId}.json`));
  console.log(`  ✓ Archived: ${gameId}`);
  
  return files;
}

/**
 * Apply RESTORE_GAME action
 * @param {object} action 
 * @param {boolean} dryRun 
 * @returns {string[]} Files affected
 */
function applyRestoreGame(action, dryRun) {
  const { gameId } = action;
  const files = [];
  
  if (dryRun) {
    console.log(`  Would restore: ${gameId}`);
    return files;
  }
  
  const game = readGameFile(gameId);
  if (!game) {
    console.log(`  ⚠ Game not found: ${gameId}`);
    return files;
  }
  
  game.archived = false;
  writeGameFile(gameId, game);
  files.push(path.join(PUBLIC_GAMES_PATH, `${gameId}.json`));
  console.log(`  ✓ Restored: ${gameId}`);
  
  return files;
}

/**
 * Apply TOGGLE_FAVORITE action
 * @param {object} action 
 * @param {boolean} dryRun 
 * @returns {string[]} Files affected
 */
function applyToggleFavorite(action, dryRun) {
  const { gameId, payload } = action;
  const files = [];
  
  if (dryRun) {
    const status = payload?.favorite ? 'favori' : 'non favori';
    console.log(`  Would toggle favorite: ${gameId} -> ${status}`);
    return files;
  }
  
  const game = readGameFile(gameId);
  if (!game) {
    console.log(`  ⚠ Game not found: ${gameId}`);
    return files;
  }
  
  game.favorite = payload?.favorite ?? !game.favorite;
  writeGameFile(gameId, game);
  files.push(path.join(PUBLIC_GAMES_PATH, `${gameId}.json`));
  console.log(`  ✓ Toggled favorite: ${gameId} (favorite=${game.favorite})`);
  
  return files;
}

/**
 * Apply DELETE_GAME action
 * @param {object} action 
 * @param {boolean} dryRun 
 * @returns {string[]} Files affected
 */
function applyDeleteGame(action, dryRun) {
  const { gameId } = action;
  const files = [];
  
  if (dryRun) {
    console.log(`  Would delete: ${gameId}.json`);
    console.log(`  Would delete image: ${gameId}-main.*`);
    return files;
  }
  
  // Delete game file
  if (deleteGameFile(gameId)) {
    files.push(path.join(PUBLIC_GAMES_PATH, `${gameId}.json`));
    console.log(`  ✓ Deleted: ${gameId}.json`);
  } else {
    console.log(`  ⚠ Game not found: ${gameId}`);
  }
  
  // Delete image
  if (deleteGameImage(gameId)) {
    // Find the actual image file that was deleted
    const extensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    for (const ext of extensions) {
      const imagePath = path.join(PUBLIC_IMAGES_PATH, `${gameId}-main.${ext}`);
      files.push(imagePath);
      break;
    }
  }
  
  return files;
}

/**
 * Apply a single action
 * @param {object} action 
 * @param {boolean} dryRun 
 * @returns {string[]} Files affected
 */
function applyAction(action, dryRun) {
  const { type, gameId } = action;
  
  console.log(`\n[${type}] ${gameId}`);
  
  switch (type) {
    case ActionType.ADD_GAME:
      return applyAddGame(action, dryRun);
    case ActionType.UPDATE_GAME:
      return applyUpdateGame(action, dryRun);
    case ActionType.ARCHIVE_GAME:
      return applyArchiveGame(action, dryRun);
    case ActionType.RESTORE_GAME:
      return applyRestoreGame(action, dryRun);
    case ActionType.TOGGLE_FAVORITE:
      return applyToggleFavorite(action, dryRun);
    case ActionType.DELETE_GAME:
      return applyDeleteGame(action, dryRun);
    default:
      console.log(`  ⚠ Unknown action type: ${type}`);
      return [];
  }
}

// ============================================================================
// Main Function
// ============================================================================

/**
 * Main function to apply session changes
 */
async function main() {
  // Parse arguments
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const noCommit = args.includes('--no-commit');
  const showHelp = args.includes('--help');
  
  if (showHelp) {
    console.log(`
Usage: node scripts/apply-changes.js <session-history.json> [options]

Options:
  --dry-run     Preview changes without applying
  --no-commit   Apply changes without Git workflow (for testing)
  --help        Show this help message

Workflow:
  1. Creates a new branch: admin-session-YYYYMMDDTHHMMSS
  2. Applies all pending actions (one commit per action)
  3. Updates index.json
  4. Asks for validation before merging to main
  5. Asks for validation before pushing to remote
  6. Deletes the session JSON file

Examples:
  node scripts/apply-changes.js session-changes.json
  node scripts/apply-changes.js session-changes.json --dry-run
`);
    process.exit(0);
  }
  
  const sessionFile = args.find(a => !a.startsWith('--'));
  
  if (!sessionFile) {
    console.error('Usage: node scripts/apply-changes.js <session-history.json> [options]');
    console.error('Use --help for more information');
    process.exit(1);
  }
  
  // Read session history
  let actions;
  try {
    const content = fs.readFileSync(sessionFile, 'utf-8');
    actions = JSON.parse(content);
  } catch (error) {
    console.error(`Error reading session file: ${error.message}`);
    process.exit(1);
  }
  
  if (!Array.isArray(actions)) {
    console.error('Session file must contain an array of actions');
    process.exit(1);
  }
  
  if (actions.length === 0) {
    console.log('No actions to apply.');
    process.exit(0);
  }
  
  // Validate context
  if (!fs.existsSync(PUBLIC_GAMES_PATH)) {
    console.error('ERROR: Must be run at repository root (public/data/games/ not found)');
    process.exit(1);
  }
  
  // Check for uncommitted changes (excluding the session file)
  if (!dryRun && !noCommit && hasUncommittedChanges(sessionFile)) {
    console.log('⚠ You have uncommitted changes in your working directory.');
    const proceed = await askConfirmation('Continue anyway? (changes will be stashed)', false);
    if (!proceed) {
      console.log('Aborted.');
      process.exit(1);
    }
    git('stash', { stdio: 'inherit' });
  }
  
  // Print header
  console.log('═'.repeat(60));
  console.log(`Applying ${actions.length} action(s)`);
  if (dryRun) console.log('🔍 DRY RUN MODE - No changes will be made');
  if (noCommit) console.log('📦 NO-COMMIT MODE - Changes without Git workflow');
  console.log('═'.repeat(60));
  
  // Save original branch
  const originalBranch = getCurrentBranch();
  let sessionBranch = null;
  
  // Create session branch (unless no-commit mode)
  if (!dryRun && !noCommit) {
    sessionBranch = createSessionBranch();
    console.log(`\n📌 Created branch: ${sessionBranch}`);
  }
  
  // Apply all actions
  let totalFiles = [];
  for (const action of actions) {
    const files = applyAction(action, dryRun);
    totalFiles = totalFiles.concat(files);
    
    // Commit each action individually (unless dry-run or no-commit)
    if (!dryRun && !noCommit && files.length > 0) {
      const label = ActionLabels[action.type] || action.type;
      const message = `${label}: ${action.gameTitle || action.gameId}`;
      commitFiles(files, message);
      console.log(`  ✓ Committed: ${message}`);
    }
  }
  
  // Update index
  console.log('\n' + '─'.repeat(60));
  console.log('Updating index.json...');
  if (!dryRun) {
    updateIndex();
    console.log('  ✓ Updated index.json');
    
    // Commit index update
    if (!noCommit) {
      commitFiles([INDEX_PATH], 'Update games index');
      console.log('  ✓ Committed: Update games index');
    }
  } else {
    console.log('  Would update index.json');
  }
  
  // Summary
  console.log('\n' + '═'.repeat(60));
  console.log(`Summary: ${totalFiles.length} file(s) affected`);
  console.log('═'.repeat(60));
  
  // Stop here for dry-run or no-commit
  if (dryRun || noCommit) {
    console.log('\n✅ Done (no Git changes made)');
    process.exit(0);
  }
  
  // Ask before merging to main
  console.log(`\n📌 Current branch: ${sessionBranch}`);
  console.log(`   Original branch: ${originalBranch}`);
  
  const shouldMerge = await askConfirmation('Merge to main?', true);
  
  if (!shouldMerge) {
    console.log(`\n⏸️  Aborted. You are still on branch: ${sessionBranch}`);
    console.log('   You can manually merge later with:');
    console.log(`     git checkout main && git merge ${sessionBranch}`);
    process.exit(0);
  }
  
  // Merge to main
  console.log('\n🔄 Merging to main...');
  mergeToMain(sessionBranch);
  console.log(`✅ Merged to main. Branch ${sessionBranch} deleted.`);
  
  // Ask before pushing
  const shouldPush = await askConfirmation('Push to remote?', true);
  
  if (shouldPush) {
    console.log('\n📤 Pushing to remote...');
    pushToRemote();
    console.log('✅ Pushed to remote.');
  } else {
    console.log('\n⏸️  Changes are local only.');
    console.log('   Push later with: git push');
  }
  
  // Delete session file
  console.log('\n🗑️  Cleaning up...');
  try {
    fs.unlinkSync(sessionFile);
    console.log(`✅ Deleted: ${sessionFile}`);
  } catch (error) {
    console.log(`⚠️  Could not delete ${sessionFile}: ${error.message}`);
  }
  
  // Restore stashed changes if any
  const stashList = git('stash list');
  if (stashList.includes('stash@{0}')) {
    console.log('\n📦 Restoring stashed changes...');
    git('stash pop', { stdio: 'inherit' });
  }
  
  console.log('\n✅ All done!');
}

// Run main function
main().catch((error) => {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
});