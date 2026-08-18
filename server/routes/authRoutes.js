const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../db");

const router = express.Router();

router.post("/register", async (req, res) => {
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

router.post("/login", async (req, res) => {
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

    const passwordMatches = await bcrypt.compare(password, user.pass_hash);

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

router.post("/logout", (req, res) => {
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

router.get("/me", (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({
      error: "Not authenticated",
    });
  }
  next();
}, async (req, res) => {
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

module.exports = router;
