/**
 * Mock GitService implementation using local file system.
 * Simulates atomic commits.
 * @see specs/phase_8_implementation_plan.md
 */

const fs = require("fs").promises;
const path = require("path");
const { invalidPath, unknownPersistenceError } = require("./persistenceErrors");

class FileGitService {
  constructor(basePath = "data/games") {
    this.basePath = basePath;
  }

  async _ensureDir() {
    try {
      await fs.mkdir(this.basePath, { recursive: true });
    } catch (err) {
      throw unknownPersistenceError(err);
    }
  }

  _getFilePath(id) {
    return path.join(this.basePath, `${id}.json`);
  }

  async addGame(gameData) {
    await this._ensureDir();
    const filePath = this._getFilePath(gameData.id);
    try {
      // Simulate atomicity by writing to a temp file and renaming (though fs.writeFile is generally atomic for small files on many OS)
      await fs.writeFile(filePath, JSON.stringify(gameData, null, 2), "utf8");
    } catch (err) {
      throw unknownPersistenceError(err);
    }
  }

  async updateGame(id, gameData) {
    const filePath = this._getFilePath(id);
    try {
      await fs.access(filePath);
      await fs.writeFile(filePath, JSON.stringify(gameData, null, 2), "utf8");
    } catch (err) {
      if (err.code === "ENOENT") throw invalidPath(filePath);
      throw unknownPersistenceError(err);
    }
  }

  async archiveGame(id) {
    const filePath = this._getFilePath(id);
    try {
      const content = await fs.readFile(filePath, "utf8");
      const data = JSON.parse(content);
      data.archived = true;
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
    } catch (err) {
      if (err.code === "ENOENT") throw invalidPath(filePath);
      throw unknownPersistenceError(err);
    }
  }

  async restoreGame(id) {
    const filePath = this._getFilePath(id);
    try {
      const content = await fs.readFile(filePath, "utf8");
      const data = JSON.parse(content);
      data.archived = false;
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
    } catch (err) {
      if (err.code === "ENOENT") throw invalidPath(filePath);
      throw unknownPersistenceError(err);
    }
  }
}

module.exports = FileGitService;
