require("dotenv").config();
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
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

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }),
);
function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({
      error: "Not authenticated",
    });
  }

  next();
}

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
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, semesterName, semesterStartDate } = req.body;

    if (!name || !email || !password || !semesterName || !semesterStartDate) {
      return res.status(400).json({
        error: "Name, email, password, semester name, and semester start date are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: "Password must be at least 8 characters",
      });
    }

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email],
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        error: "Email is already registered",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users (name, email, pass_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email`,
      [name, email, passwordHash],
    );

    const user = result.rows[0];

    const startDate = new Date(semesterStartDate);
    if (Number.isNaN(startDate.getTime())) {
      return res.status(400).json({
        error: "Semester start date is invalid",
      });
    }

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 112);

    const semesterResult = await pool.query(
      `INSERT INTO semesters (name, start_date, end_date, user_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, start_date AS "startDate", end_date AS "endDate"`,
      [
        semesterName,
        startDate.toISOString().slice(0, 10),
        endDate.toISOString().slice(0, 10),
        user.id,
      ],
    );

    req.session.userId = user.id;

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      semester: semesterResult.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to create account",
    });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const result = await pool.query(
      `SELECT id, name, email, pass_hash
       FROM users
       WHERE email = $1`,
      [email],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    const passwordMatches = await bcrypt.compare(
      password,
      user.pass_hash,
    );

    if (!passwordMatches) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    req.session.userId = user.id;

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to log in",
    });
  }
});
app.post("/api/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error(error);
      return res.status(500).json({
        error: "Failed to log out",
      });
    }

    res.clearCookie("connect.sid");

    res.json({
      message: "Logged out",
    });
  });
});
app.get("/api/me", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email
       FROM users
       WHERE id = $1`,
      [req.session.userId],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: "User not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch user",
    });
  }
});
app.get("/api/semesters", requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
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
app.put("/api/semesters/:id", requireAuth, async (req, res) => {
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
app.post("/api/semesters", requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
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
app.delete("/api/semesters/:id", requireAuth, async (req, res) => {
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

app.get("/api/classes", requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;

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
app.post("/api/classes", requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;

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
app.put("/api/classes/:id", requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
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
app.delete("/api/classes/:id", requireAuth, async (req, res) => {
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
app.get("/api/assignments", requireAuth, async (req, res) => {
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
app.post("/api/assignments", requireAuth, async (req, res) => {
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
app.put("/api/assignments/:id", requireAuth, async (req, res) => {
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
app.delete("/api/assignments/:id", requireAuth, async (req, res) => {
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
app.get("/api/notes", requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
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
app.put("/api/notes", requireAuth, async (req, res) => {
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