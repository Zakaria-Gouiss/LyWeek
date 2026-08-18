require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");
pool.query("SELECT current_database()", (error, result) => {
  if (error) {
    console.error(error);
  } else {
    console.log("Backend database:", result.rows[0]);
  }
});
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

console.log("About to start Express...");

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


app.get("/", (req, res) => {
  res.send("LyWeek backend is running");
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Database connection failed");
  }
});
app.get("/api/semesters", async (req, res) => {
  try {
    const userId = 1;
    const result = await pool.query(`
      SELECT
        id,
        name,
        start_date AS "startDate",
        end_date AS "endDate"
      FROM semesters
      WHERE user_id = $1`,
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
app.put("/api/semesters/:id", async (req, res) => {
  try {
    const userId = 1;
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
        start_date AS "startDate",
        end_date AS "endDate"
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
app.post("/api/semesters", async (req, res) => {
  try {
    const userId = 1;
    const { name, startDate, endDate } = req.body;

    const result = await pool.query(
      `INSERT INTO semesters
        (name, start_date, end_date, user_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, start_date AS "startDate",
                 end_date AS "endDate";`,
      [name, startDate, endDate, userId],
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create semester" });
  }
});
app.delete("/api/semesters/:id", async (req, res) => {
  try {
    const userId = 1;
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
async function hasClassColorColumn() {
  const result = await pool.query(`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_name = 'classes' AND column_name = 'color'
    ) AS "hasColorColumn"
  `);

  return result.rows[0]?.hasColorColumn ?? false;
}

app.get("/api/classes", async (req, res) => {
  try {
    const userId = 1;

    const result = await pool.query(
      `SELECT id, name, course_code AS "courseCode",
        professor, course_hours AS "courseHours",
        office_hours AS "officeHours",
        onenote_url AS "onenoteUrl",
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
app.post("/api/classes", async (req, res) => {
  try {
    const userId = 1;

    const {
      name,
      courseCode,
      professor,
      courseHours,
      officeHours,
      onenoteUrl,
      color,
      semesterId,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO classes
        (name, course_code, professor, course_hours,
         office_hours, onenote_url, color, semester_id, user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, name, course_code AS "courseCode",
                 professor, course_hours AS "courseHours",
                 office_hours AS "officeHours",
                 onenote_url AS "onenoteUrl",
                 color, semester_id AS "semesterId";`,
      [
        name,
        courseCode,
        professor,
        courseHours,
        officeHours,
        onenoteUrl,
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
app.put("/api/classes/:id", async (req, res) => {
  try {
    const userId = 1;
    const { id } = req.params;

    const {
      name,
      courseCode,
      professor,
      courseHours,
      officeHours,
      onenoteUrl,
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
           onenote_url = $6,
           color = $7,
           semester_id = $8
       WHERE id = $9 AND user_id = $10
       RETURNING id, name, course_code AS "courseCode",
                 professor, course_hours AS "courseHours",
                 office_hours AS "officeHours",
                 onenote_url AS "onenoteUrl",
                 color, semester_id AS "semesterId";`,
      [
        name,
        courseCode,
        professor,
        courseHours,
        officeHours,
        onenoteUrl,
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
app.delete("/api/classes/:id", async (req, res) => {
  try {
    const userId = 1;
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
app.get("/api/assignments", async (req, res) => {
  try {
    const userId = 1;

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
app.post("/api/assignments", async (req, res) => {
  try {
    const userId = 1;
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
app.put("/api/assignments/:id", async (req, res) => {
  try {
    const userId = 1;
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
app.delete("/api/assignments/:id", async (req, res) => {
  try {
    const userId = 1;
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
app.get("/api/notes", async (req, res) => {
  try {
    const userId = 1;
    const result = await pool.query(
      "SELECT * FROM notes WHERE user_id = $1 ORDER BY id", [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch notes",
    });
  }
});
app.put("/api/notes", async (req, res) => {
  try {
    const { content } = req.body;
    const userId = 1;

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