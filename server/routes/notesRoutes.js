const express = require("express");
const pool = require("../db");

const router = express.Router();

// Middleware to check authentication
function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({
      error: "Not authenticated",
    });
  }
  next();
}

router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const result = await pool.query(
      "SELECT * FROM notes WHERE user_id = $1 ORDER BY id",
      [userId],
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch notes",
    });
  }
});

router.put("/", requireAuth, async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.session.userId;

    const result = await pool.query(
      `UPDATE notes
       SET content = $1
       WHERE id = 1 AND user_id = $2
       RETURNING id, content`,
      [content, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Notes not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to save notes",
    });
  }
});

module.exports = router;
