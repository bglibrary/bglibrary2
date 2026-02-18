const simpleGit = require('simple-git');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const { persistenceErrors } = require('./persistenceErrors');

/**
 * SimpleGitService implements the GitServiceContract by cloning the repository
 * in a temporary directory for each write operation.
 * This is designed to work with Render's ephemeral filesystem.
 */
class SimpleGitService {
  /**
   * @param {Object} config
   * @param {string} config.repoUrl - The full HTTPS URL with credentials (https://user:token@github.com/...)
   * @param {string} [config.branch='main'] - The branch to work on
   * @param {string} [config.basePath='data/games'] - Path to games data in repo
   */
  constructor(config) {
    if (!config.repoUrl) {
      throw new Error('repoUrl is required for SimpleGitService');
    }
    this.repoUrl = config.repoUrl;
    this.branch = config.branch || 'main';
    this.basePath = config.basePath || 'data/games';
  }

  /**
   * Internal helper to execute operations within a temporary clone.
   * Ensures the temporary directory is deleted even if the operation fails.
   * 
   * @param {Function} callback - Async function receiving (repoPath, gitInstance)
   * @returns {Promise<any>} Result of the callback
   * @private
   */
  async _withTempRepo(callback) {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bglibrary-git-'));
    console.log(`[GitService] Created temp directory: ${tempDir}`);
    
    try {
      const git = simpleGit();
      
      console.log(`[GitService] Cloning branch ${this.branch}...`);
      await git.clone(this.repoUrl, tempDir, ['--branch', this.branch, '--depth', '1']);
      
      const localGit = simpleGit(tempDir);
      
      // Configure local user for commit
      await localGit.addConfig('user.name', 'BGLibrary Admin');
      await localGit.addConfig('user.email', 'admin@bglibrary.com');

      return await callback(tempDir, localGit);
    } catch (err) {
      console.error('[GitService] Error during git operation:', err);
      if (err.message.includes('Authentication failed')) {
        throw persistenceErrors.authenticationError();
      }
      if (err.message.includes('conflict') || err.message.includes('rejected')) {
        throw persistenceErrors.writeConflict();
      }
      throw persistenceErrors.unknownPersistenceError(err.message);
    } finally {
      try {
        await fs.rm(tempDir, { recursive: true, force: true });
        console.log(`[GitService] Cleaned up temp directory: ${tempDir}`);
      } catch (cleanupErr) {
        console.error(`[GitService] Failed to cleanup ${tempDir}:`, cleanupErr);
      }
    }
  }

  /**
   * Adds a new game.
   * @param {Object} gameData
   */
  async addGame(gameData) {
    return this._withTempRepo(async (repoPath, git) => {
      const filePath = path.join(repoPath, this.basePath, `${gameData.id}.json`);
      
      // Ensure directory exists
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      
      await fs.writeFile(filePath, JSON.stringify(gameData, null, 2), 'utf8');
      
      await git.add('.');
      await git.commit(`feat: Add game ${gameData.title}`);
      await git.push('origin', this.branch);
      console.log(`[GitService] Successfully added game: ${gameData.id}`);
    });
  }

  /**
   * Updates an existing game.
   * @param {string} id
   * @param {Object} gameData
   */
  async updateGame(id, gameData) {
    return this._withTempRepo(async (repoPath, git) => {
      const filePath = path.join(repoPath, this.basePath, `${id}.json`);
      
      try {
        await fs.access(filePath);
      } catch (err) {
        throw persistenceErrors.invalidPath(id);
      }

      await fs.writeFile(filePath, JSON.stringify(gameData, null, 2), 'utf8');
      
      await git.add('.');
      await git.commit(`fix: Update game ${gameData.title}`);
      await git.push('origin', this.branch);
      console.log(`[GitService] Successfully updated game: ${id}`);
    });
  }

  /**
   * Archives a game.
   * @param {string} id
   * @param {Object} gameData - The updated game data with archived=true
   */
  async archiveGame(id, gameData) {
    return this._withTempRepo(async (repoPath, git) => {
      const filePath = path.join(repoPath, this.basePath, `${id}.json`);
      
      await fs.writeFile(filePath, JSON.stringify(gameData, null, 2), 'utf8');
      
      await git.add('.');
      await git.commit(`chore: Archive game ${id}`);
      await git.push('origin', this.branch);
      console.log(`[GitService] Successfully archived game: ${id}`);
    });
  }

  /**
   * Restores a game.
   * @param {string} id
   * @param {Object} gameData - The updated game data with archived=false
   */
  async restoreGame(id, gameData) {
    return this._withTempRepo(async (repoPath, git) => {
      const filePath = path.join(repoPath, this.basePath, `${id}.json`);
      
      await fs.writeFile(filePath, JSON.stringify(gameData, null, 2), 'utf8');
      
      await git.add('.');
      await git.commit(`chore: Restore game ${id}`);
      await git.push('origin', this.branch);
      console.log(`[GitService] Successfully restored game: ${id}`);
    });
  }
}

module.exports = SimpleGitService;
