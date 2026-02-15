import { Octokit } from '@octokit/rest';
import { persistenceErrors } from './persistenceErrors';

/**
 * GitHubGitService implements the GitServiceContract using the GitHub REST API.
 */
export class GitHubGitService {
  constructor(config) {
    this.octokit = new Octokit({ auth: config.token });
    this.owner = config.owner;
    this.repo = config.repo;
    this.branch = config.branch || 'main';
    this.basePath = config.basePath || 'data/games';
  }

  /**
   * Helper to fetch file SHA (needed for updates in GitHub API)
   */
  async _getFileSha(path) {
    try {
      const { data } = await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path,
        ref: this.branch
      });
      return data.sha;
    } catch (err) {
      if (err.status === 404) return null;
      throw err;
    }
  }

  /**
   * Helper to commit a file change
   */
  async _commitFile(path, content, message, sha = null) {
    try {
      await this.octokit.repos.createOrUpdateFileContents({
        owner: this.owner,
        repo: this.repo,
        path,
        message,
        content: Buffer.from(JSON.stringify(content, null, 2)).toString('base64'),
        branch: this.branch,
        sha: sha || undefined
      });
    } catch (err) {
      console.error(`GitHub commit failed for ${path}:`, err);
      if (err.status === 401 || err.status === 403) throw persistenceErrors.authenticationError();
      if (err.status === 409) throw persistenceErrors.writeConflict();
      throw persistenceErrors.unknownPersistenceError(err.message);
    }
  }

  async addGame(gameData) {
    const path = `${this.basePath}/${gameData.id}.json`;
    await this._commitFile(path, gameData, `feat: Add game ${gameData.title}`);
  }

  async updateGame(id, gameData) {
    const path = `${this.basePath}/${id}.json`;
    const sha = await this._getFileSha(path);
    if (!sha) throw persistenceErrors.invalidPath();
    await this._commitFile(path, gameData, `fix: Update game ${gameData.title}`, sha);
  }

  async archiveGame(id, gameData) {
    const path = `${this.basePath}/${id}.json`;
    const sha = await this._getFileSha(path);
    if (!sha) throw persistenceErrors.invalidPath();
    await this._commitFile(path, gameData, `chore: Archive game ${id}`, sha);
  }

  async restoreGame(id, gameData) {
    const path = `${this.basePath}/${id}.json`;
    const sha = await this._getFileSha(path);
    if (!sha) throw persistenceErrors.invalidPath();
    await this._commitFile(path, gameData, `chore: Restore game ${id}`, sha);
  }
}
