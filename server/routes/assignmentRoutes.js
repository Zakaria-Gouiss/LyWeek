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
      `SELECT id, class_id AS "classId",
              name, priority, due_date AS "dueDate",
              completed
       FROM assignments
       WHERE user_id = $1
       ORDER BY due_date;`,
      [userId],
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const { classId, name, priority, dueDate, completed } = req.body;

    const result = await pool.query(
      `INSERT INTO assignments
        (class_id, name, priority, due_date, completed, user_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, class_id AS "classId",
                 name, priority, due_date AS "dueDate",
                 completed;`,
      [classId, name, priority, dueDate, completed, userId],
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create assignment" });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const { id } = req.params;
    const { classId, name, priority, dueDate, completed } = req.body;

    const result = await pool.query(
      `UPDATE assignments
       SET class_id = $1,
           name = $2,
           priority = $3,
           due_date = $4,
           completed = $5
       WHERE id = $6 AND user_id = $7
       RETURNING id, class_id AS "classId",
                 name, priority, due_date AS "dueDate",
                 completed;`,
      [classId, name, priority, dueDate, completed, id, userId],
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update assignment" });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const { id } = req.params;

    await pool.query(
      `DELETE FROM assignments
       WHERE id = $1 AND user_id = $2;`,
      [id, userId],
    );

    res.json({ message: "Assignment deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete assignment" });
  }
});

module.exports = router;
