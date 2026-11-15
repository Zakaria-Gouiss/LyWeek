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
      `SELECT id, name, course_code AS "courseCode",
        professor, course_hours AS "courseHours",
        office_hours AS "officeHours",
        color
       FROM classes
       WHERE user_id = $1;`,
      [userId],
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch classes" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;

    const {
      name,
      courseCode,
      professor,
      courseHours,
      officeHours,
      color,
      semesterId,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO classes
        (name, course_code, professor, course_hours,
         office_hours, color, semester_id, user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, name, course_code AS "courseCode",
                 professor, course_hours AS "courseHours",
                 office_hours AS "officeHours",
                 color, semester_id AS "semesterId";`,
      [
        name,
        courseCode,
        professor,
        courseHours,
        officeHours,
        color,
        semesterId,
        userId,
      ],
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create class" });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const { id } = req.params;

    const {
      name,
      courseCode,
      professor,
      courseHours,
      officeHours,
      color,
      semesterId,
    } = req.body;

    const result = await pool.query(
      `UPDATE classes
       SET name = $1,
           course_code = $2,
           professor = $3,
           course_hours = $4,
           office_hours = $5,
           color = $6,
           semester_id = $7
       WHERE id = $8 AND user_id = $9
       RETURNING id, name, course_code AS "courseCode",
                 professor, course_hours AS "courseHours",
                 office_hours AS "officeHours",
                 color, semester_id AS "semesterId";`,
      [
        name,
        courseCode,
        professor,
        courseHours,
        officeHours,
        color,
        semesterId,
        id,
        userId,
      ],
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update class" });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const { id } = req.params;

    await pool.query(
      `DELETE FROM classes
       WHERE id = $1 AND user_id = $2;`,
      [id, userId],
    );

    res.json({ message: "Class deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete class" });
  }
});

module.exports = router;
