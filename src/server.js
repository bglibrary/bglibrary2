const express = require('express');
const { AdminGameService } = require('./admin/AdminGameService');
const SimpleGitService = require('./infrastructure/SimpleGitService');

const app = express();
app.use(express.json());

// Configuration from environment variables
const gitConfig = {
  repoUrl: process.env.GIT_REPO_URL, // Must include credentials: https://user:token@github.com/repo.git
  branch: process.env.GIT_BRANCH || 'main',
  basePath: process.env.GIT_DATA_PATH || 'data/games'
};

// Initialize services
let adminGameService;
try {
  const gitService = new SimpleGitService(gitConfig);
  adminGameService = new AdminGameService(gitService);
} catch (err) {
  console.error('Failed to initialize AdminGameService:', err.message);
}

// Routes
app.post('/api/admin/games', async (req, res) => {
  if (!adminGameService) return res.status(500).json({ error: 'Service not initialized' });
  try {
    await adminGameService.addGame(req.body);
    res.status(201).json({ message: 'Game added successfully' });
  } catch (err) {
    const status = err.type === 'ValidationError' ? 400 : 500;
    res.status(status).json({ error: err.message });
  }
});

app.put('/api/admin/games/:id', async (req, res) => {
  if (!adminGameService) return res.status(500).json({ error: 'Service not initialized' });
  try {
    await adminGameService.updateGame(req.params.id, req.body);
    res.status(200).json({ message: 'Game updated successfully' });
  } catch (err) {
    let status = 500;
    if (err.type === 'ValidationError') status = 400;
    if (err.type === 'GameNotFound') status = 404;
    if (err.message && err.message.includes('conflict')) status = 409;
    res.status(status).json({ error: err.message });
  }
});

app.post('/api/admin/games/:id/archive', async (req, res) => {
  if (!adminGameService) return res.status(500).json({ error: 'Service not initialized' });
  try {
    await adminGameService.archiveGame(req.params.id);
    res.status(200).json({ message: 'Game archived successfully' });
  } catch (err) {
    const status = err.type === 'GameNotFound' ? 404 : 500;
    res.status(status).json({ error: err.message });
  }
});

app.post('/api/admin/games/:id/restore', async (req, res) => {
  if (!adminGameService) return res.status(500).json({ error: 'Service not initialized' });
  try {
    await adminGameService.restoreGame(req.params.id);
    res.status(200).json({ message: 'Game restored successfully' });
  } catch (err) {
    const status = err.type === 'GameNotFound' ? 404 : 500;
    res.status(status).json({ error: err.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Admin Backend listening on port ${PORT}`);
});
