const express = require("express");
const pool = require("../db");

const router = express.Router();

function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
}

function validateLink(name, url) {
  if (typeof name !== "string" || !name.trim()) {
    return "A link name is required";
  }
  if (typeof url !== "string" || !url.trim()) {
    return "A URL is required";
  }
  try {
    const protocol = new URL(url.trim()).protocol.toLowerCase();
    if (["javascript:", "data:", "vbscript:"].includes(protocol)) {
      return "This URL type is not allowed";
    }
  } catch {
    return "Enter a valid URL or app link";
  }
  return null;
}

router.get("/", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT links.id, links.class_id AS "classId",
              links.name, links.url, links.sort_order AS "sortOrder"
       FROM links
       JOIN classes ON classes.id = links.class_id
       WHERE classes.user_id = $1
       ORDER BY links.class_id, links.sort_order, links.id`,
      [req.session.userId],
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch links" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  const { classId, name, url } = req.body;
  const validationError = validateLink(name, url);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }
  if (!Number.isInteger(Number(classId)) || Number(classId) <= 0) {
    return res.status(400).json({ error: "A valid class ID is required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO links (class_id, name, url, sort_order)
       SELECT classes.id, $2, $3,
              COALESCE((SELECT MAX(sort_order) + 1
                        FROM links WHERE class_id = classes.id), 0)
       FROM classes
       WHERE classes.id = $1 AND classes.user_id = $4
       RETURNING id, class_id AS "classId", name, url,
                 sort_order AS "sortOrder"`,
      [classId, name.trim(), url.trim(), req.session.userId],
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Class not found" });
    }
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create link" });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  const { name, url } = req.body;
  const validationError = validateLink(name, url);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const result = await pool.query(
      `UPDATE links
       SET name = $1, url = $2
       FROM classes
       WHERE links.id = $3
         AND classes.id = links.class_id
         AND classes.user_id = $4
       RETURNING links.id, links.class_id AS "classId",
                 links.name, links.url,
                 links.sort_order AS "sortOrder"`,
      [name.trim(), url.trim(), req.params.id, req.session.userId],
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Link not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update link" });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM links
       USING classes
       WHERE links.id = $1
         AND classes.id = links.class_id
         AND classes.user_id = $2`,
      [req.params.id, req.session.userId],
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Link not found" });
    }
    res.json({ message: "Link deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete link" });
  }
});

module.exports = router;
