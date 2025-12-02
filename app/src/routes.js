import express from "express";
import { pool } from "./db.js";

export function createRouter() {
  const router = express.Router();

  // Healthcheck: проверка БД
  router.get("/health", async (req, res) => {
    try {
      await pool.query("SELECT 1");
      res.json({ status: "ok", db: "up" });
    } catch (err) {
      console.error("Healthcheck DB error:", err);
      res.status(500).json({ status: "error", db: "down" });
    }
  });

  // GET /notes
  router.get("/notes", async (req, res) => {
    try {
      const result = await pool.query(
        "SELECT id, title, body, created_at, updated_at FROM notes ORDER BY id DESC"
      );
      res.json(result.rows);
    } catch (err) {
      console.error("GET /notes error:", err);
      res.status(500).json({ error: "Failed to fetch notes" });
    }
  });

  // GET /notes/:id
  router.get("/notes/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });

    try {
      const result = await pool.query(
        "SELECT id, title, body, created_at, updated_at FROM notes WHERE id = $1",
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Note not found" });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error("GET /notes/:id error:", err);
      res.status(500).json({ error: "Failed to fetch note" });
    }
  });

  // POST /notes
  router.post("/notes", express.json(), async (req, res) => {
    const { title, body } = req.body || {};
    if (!title) {
      return res.status(400).json({ error: "title is required" });
    }

    try {
      const result = await pool.query(
        `INSERT INTO notes (title, body)
         VALUES ($1, $2)
         RETURNING id, title, body, created_at, updated_at`,
        [title, body ?? null]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error("POST /notes error:", err);
      res.status(500).json({ error: "Failed to create note" });
    }
  });

  // PUT /notes/:id
  router.put("/notes/:id", express.json(), async (req, res) => {
    const id = Number(req.params.id);
    const { title, body } = req.body || {};
    if (!id) return res.status(400).json({ error: "Invalid id" });
    if (!title && !body) {
      return res.status(400).json({ error: "Nothing to update" });
    }

    try {
      const result = await pool.query(
        `
        UPDATE notes
        SET
          title = COALESCE($1, title),
          body = COALESCE($2, body),
          updated_at = NOW()
        WHERE id = $3
        RETURNING id, title, body, created_at, updated_at
        `,
        [title ?? null, body ?? null, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Note not found" });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error("PUT /notes/:id error:", err);
      res.status(500).json({ error: "Failed to update note" });
    }
  });

  // DELETE /notes/:id
  router.delete("/notes/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });

    try {
      const result = await pool.query(
        "DELETE FROM notes WHERE id = $1 RETURNING id",
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Note not found" });
      }
      res.status(204).send();
    } catch (err) {
      console.error("DELETE /notes/:id error:", err);
      res.status(500).json({ error: "Failed to delete note" });
    }
  });

  return router;
}
