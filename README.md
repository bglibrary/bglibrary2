# Board Game Library

Personal board game library application.

## Setup local

To set up the project locally, follow these steps:

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/bglibrary/bglibrary2.git
    cd bglibrary2
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Run the development server**:

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

4.  **Run tests**:

    ```bash
    npm test
    ```

## Setup on Render (Free Tier)

This project is designed to be deployable on Render's free tier, including an admin backend that performs Git operations directly. 

### 1. Create a new Web Service on Render

*   Connect your GitHub repository.
*   **Runtime**: Node
*   **Build Command**: `npm install`
*   **Start Command**: `node src/server.js` (This will start the Express backend for admin operations).

### 2. Configure Environment Variables

To enable Git operations from the backend, you must configure the following environment variables in your Render service settings:

*   `GIT_REPO_URL`: The full HTTPS URL of your repository, including your GitHub username and a Personal Access Token (PAT). Format: `https://your-username:your-pat@github.com/your-username/your-repository.git`
    *   **Important**: Ensure your PAT has `repo` permissions.
*   `GIT_USERNAME`: Your GitHub username.
*   `GIT_TOKEN`: Your GitHub Personal Access Token (PAT).
*   `GIT_BRANCH` (Optional): The branch to perform Git operations on (default: `main`).
*   `GIT_DATA_PATH` (Optional): The path within your repository where game data JSON files are stored (default: `data/games`).

### 3. Deploy

Once environment variables are set, deploy your service. Render will automatically build and start your application.

### 4. Accessing the Admin API

The admin API endpoints will be available at `/api/admin/*` on your Render service URL. For example, to add a game:

`POST https://your-render-app.onrender.com/api/admin/games`

Remember to protect your admin routes appropriately (e.g., with a token or basic authentication) in a production environment. This implementation currently relies on the Git token for authentication to Git itself, but does not provide API-level authentication for the Express endpoints.
