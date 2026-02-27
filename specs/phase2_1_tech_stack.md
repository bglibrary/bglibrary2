# phase2_1_tech_stack.md (updated)

## Frontend

**Framework / Library:** React (latest stable)  
- Same justification as before  
- Additional usage: Admin GUI form

**Styling:** Tailwind CSS  
- Same justification  
- Applied to admin form layout

**Routing / Navigation:** React Router  
- Includes routes for admin pages:
  - /admin
  - /admin/add-game
  - /admin/edit-game/:id

---

## Backend / Static Site Generation

**Static Site Generator:** Next.js (React-based, SSG mode)  
- Same justification  
- **No API routes required** - Admin uses session-based approach
- All pages are pre-rendered at build time
- Admin interface runs entirely in the browser

**Data Format:** JSON for game data  
- Same justification  
- Admin GUI generates Python script for updates

---

## Admin Persistence Strategy

**Session-Based Approach:**  
- All admin changes are stored in browser memory (session history)
- Optional localStorage for session recovery across page reloads
- No backend or API calls required
- Changes are exported as a Python script

**Python Script Execution:**  
- Admin downloads generated `update_library.py`
- Script is executed locally at repository root
- Script handles:
  - File creation/update in `data/games/*.json`
  - Git operations (add, commit, push)
  - Error handling and validation

---

## Hosting / Deployment

- Render static hosting (or GitHub Pages)
- **No serverless functions required**
- Build triggered automatically on repo update
- Deployment is pure static file serving

---

## Tools / Build

- Node.js (LTS version)  
- npm or yarn  
- ESLint + Prettier  
- Tailwind CLI / PostCSS  
- **No GitHub API libraries required** (replaced by Python script)
- **serve** (required for static production serving)

---

## npm Scripts

| Command | Purpose | Notes |
|---------|---------|-------|
| `npm run dev` | Development server | Uses Next.js dev server with hot reload |
| `npm run build` | Build static site | Generates `out/` folder with static files |
| `npm start` | Production preview | Serves `out/` folder using `serve` package |

### Static Export Configuration

The project uses `output: 'export'` in `next.config.js` to generate a fully static site:

```javascript
// next.config.js
const nextConfig = {
  output: 'export',  // Enables static HTML export
  trailingSlash: true,
  images: {
    unoptimized: true,  // Required for static export
  },
};
```

**Important:** 
- `next start` does NOT work with `output: 'export'` - it requires a server build
- Use `serve out` instead to preview the static build locally
- The `serve` package must be installed as a dev dependency

---

## Rationale Summary

| Requirement | Choice | Why |
|-------------|--------|-----|
| Responsive frontend + admin GUI | React + Tailwind | Large ecosystem, simple form creation |
| Static content | Next.js SSG | Generates static site, no server needed |
| Data storage | JSON | Simple, human-readable, versionable |
| Admin persistence | Session + Python script | Zero backend, maximum simplicity |
| Hosting | Render (static) | Free, automatic rebuild on repo push |
| Documentation | Markdown + inline | Fully explicit, maintainable |

---

## Key Changes from Previous Architecture

| Aspect | Previous | New (Session-Based) |
|--------|----------|---------------------|
| Backend | Next.js API routes | None (static only) |
| Persistence | GitHub API calls | Python script |
| Admin Auth | Token-based | None (static site) |
| Admin Responsive | Full responsive | Desktop/tablet only |
| Deployment | Static + serverless | Pure static |