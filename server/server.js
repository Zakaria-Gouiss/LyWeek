require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const pool = require("./db");

// Route imports
const authRoutes = require("./routes/authRoutes");
const semesterRoutes = require("./routes/semesterRoutes");
const classRoutes = require("./routes/classRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const notesRoutes = require("./routes/notesRoutes");

pool.query("SELECT current_database()", (error, result) => {
  if (error) {
    console.error(error);
  } else {
    console.log("Backend database:", result.rows[0]);
  }
});

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:4173"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));
app.use(express.json());
app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 1000 * 60 * 60 * 24 * 7,
},
  }),
);

console.log("About to start Express...");

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("LyWeek backend is running");
});

// Test database connection
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Database connection failed");
  }
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});
// API Routes
app.use("/api/auth", authRoutes);
app.use("/api", authRoutes); // For backward compatibility with /api/login, /api/register, /api/logout, /api/me
app.use("/api/semesters", semesterRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/notes", notesRoutes);