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
      `
      SELECT
        id,
        name,
        TO_CHAR(start_date, 'YYYY-MM-DD') AS "startDate",
        TO_CHAR(end_date, 'YYYY-MM-DD') AS "endDate"
      FROM semesters
      WHERE user_id = $1
      `,
      [userId],
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch semesters",
    });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const { id } = req.params;
    const { name, startDate, endDate } = req.body;

    const result = await pool.query(
      `
      UPDATE semesters
      SET name = $1,
          start_date = $2,
          end_date = $3
      WHERE id = $4 AND user_id = $5
      RETURNING
        id,
        name,
        TO_CHAR(start_date, 'YYYY-MM-DD') AS "startDate",
        TO_CHAR(end_date, 'YYYY-MM-DD') AS "endDate"
      `,
      [name, startDate, endDate, id, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Semester not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to update semester",
    });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const { name, startDate, endDate } = req.body;

    const result = await pool.query(
      `INSERT INTO semesters
        (name, start_date, end_date, user_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, start_date AS "startDate",
                 end_date AS "endDate"`,
      [name, startDate, endDate, userId],
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create semester" });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const { id } = req.params;

    await pool.query(
      `DELETE FROM semesters
       WHERE id = $1 AND user_id = $2;`,
      [id, userId],
    );

    res.json({ message: "Semester deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete semester" });
  }
});

module.exports = router;
