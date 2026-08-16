const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());


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
app.get("/api/classes", async (req, res) => {
  try {
    const result = await pool.query(`
  SELECT
    id,
    name,
    course_code AS "courseCode",
    professor,
    course_hours AS "courseHours",
    office_hours AS "officeHours",
    onenote_url AS "onenoteUrl"
  FROM classes
`);
app.post("/api/classes", async (req, res) => {
  try {
    const {
      name,
      courseCode,
      professor,
      courseHours,
      officeHours,
      onenoteUrl,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO classes
        (name, course_code, professor, course_hours, office_hours, onenote_url)
      VALUES
        ($1, $2, $3, $4, $5, $6)
      RETURNING
        id,
        name,
        course_code AS "courseCode",
        professor,
        course_hours AS "courseHours",
        office_hours AS "officeHours",
        onenote_url AS "onenoteUrl"
      `,
      [
        name,
        courseCode,
        professor,
        courseHours,
        officeHours,
        onenoteUrl,
      ],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to create class",
    });
  }
});
app.put("/api/classes/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      courseCode,
      professor,
      courseHours,
      officeHours,
      onenoteUrl,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE classes
      SET
        name = $1,
        course_code = $2,
        professor = $3,
        course_hours = $4,
        office_hours = $5,
        onenote_url = $6
      WHERE id = $7
      RETURNING
        id,
        name,
        course_code AS "courseCode",
        professor,
        course_hours AS "courseHours",
        office_hours AS "officeHours",
        onenote_url AS "onenoteUrl"
      `,
      [
        name,
        courseCode,
        professor,
        courseHours,
        officeHours,
        onenoteUrl,
        id,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Class not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to update class",
    });
  }
});
app.delete("/api/classes/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM classes WHERE id = $1 RETURNING id",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Class not found",
      });
    }

    res.json({
      message: "Class deleted successfully",
      id: result.rows[0].id,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to delete class",
    });
  }
});
app.get("/api/assignments", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        class_id AS "classId",
        name,
        priority,
        due_date AS "dueDate",
        completed
      FROM assignments
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch assignments",
    });
  }
});
app.post("/api/assignments", async (req, res) => {
  try {
    const {
      classId,
      name,
      priority,
      dueDate,
      completed,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO assignments
        (class_id, name, priority, due_date, completed)
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING
        id,
        class_id AS "classId",
        name,
        priority,
        due_date AS "dueDate",
        completed
      `,
      [
        classId,
        name,
        priority,
        dueDate,
        completed ?? false,
      ],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to create assignment",
    });
  }
});
app.put("/api/assignments/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      classId,
      name,
      priority,
      dueDate,
      completed,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE assignments
      SET
        class_id = $1,
        name = $2,
        priority = $3,
        due_date = $4,
        completed = $5
      WHERE id = $6
      RETURNING
        id,
        class_id AS "classId",
        name,
        priority,
        due_date AS "dueDate",
        completed
      `,
      [
        classId,
        name,
        priority,
        dueDate,
        completed,
        id,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Assignment not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to update assignment",
    });
  }
});
app.delete("/api/assignments/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM assignments WHERE id = $1 RETURNING id",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Assignment not found",
      });
    }

    res.json({
      message: "Assignment deleted successfully",
      id: result.rows[0].id,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to delete assignment",
    });
  }
});
app.get("/api/notes", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, content FROM notes WHERE id = 1",
    );

    res.json(result.rows[0]);
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

    const result = await pool.query(
      "UPDATE notes SET content = $1 WHERE id = 1 RETURNING id, content",
      [content],
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to save notes",
    });
  }
});

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch classes",
    });
  }
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

