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

