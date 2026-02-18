import { AdminGameService } from "../../../src/admin/AdminGameService";
import { FileGitService } from "../../../src/infrastructure/FileGitService";

const gitService = new FileGitService();
const adminService = new AdminGameService(gitService);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Missing id" });
  }

  try {
    await adminService.restoreGame(id);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("API Error:", err);
    return res
      .status(500)
      .json({ error: err.message || "Failed to restore game" });
  }
}
