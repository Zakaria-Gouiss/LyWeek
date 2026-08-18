require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// -------------------------
// Random helpers
// -------------------------

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomBool() {
  return Math.random() < 0.5;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomHexColor() {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 70 + Math.floor(Math.random() * 20);
  const lightness = 48 + Math.floor(Math.random() * 12);

  const h = hue / 360;
  const s = saturation / 100;
  const l = lightness / 100;

  function hueToRgb(p, q, t) {
    let temp = t;
    if (temp < 0) temp += 1;
    if (temp > 1) temp -= 1;
    if (temp < 1 / 6) return p + (q - p) * 6 * temp;
    if (temp < 1 / 2) return q;
    if (temp < 2 / 3) return p + (q - p) * (2 / 3 - temp) * 6;
    return p;
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = Math.round(hueToRgb(p, q, h + 1 / 3) * 255);
  const g = Math.round(hueToRgb(p, q, h) * 255);
  const b = Math.round(hueToRgb(p, q, h - 1 / 3) * 255);

  return `#${[r, g, b]
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
}

// -------------------------
// Fake data
// -------------------------

const semesters = [
  {
    name: "Fall 2026",
    startDate: "2026-08-24",
    endDate: "2026-12-12",
  },
  {
    name: "Spring 2027",
    startDate: "2027-01-11",
    endDate: "2027-05-01",
  },
  {
    name: "Summer 2027",
    startDate: "2027-05-17",
    endDate: "2027-08-07",
  },
];

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const classNames = [
  "Data Structures",
  "Computer Networks",
  "Database Systems",
  "Operating Systems",
  "Software Engineering",
  "Computer Architecture",
  "Web Development",
  "Artificial Intelligence",
  "Cybersecurity",
  "Discrete Mathematics",
];

const courseCodes = [
  "CS 300",
  "CS 305",
  "CS 310",
  "CS 315",
  "CS 320",
  "CS 325",
  "CS 330",
  "CS 350",
  "CS 360",
  "CS 370",
];

const professors = [
  "Dr. Smith",
  "Dr. Johnson",
  "Dr. Williams",
  "Dr. Brown",
  "Dr. Davis",
  "Dr. Miller",
  "Dr. Wilson",
  "Dr. Anderson",
];

const courseHours = [
  "MWF 9:00 AM - 9:50 AM",
  "MWF 10:00 AM - 10:50 AM",
  "MWF 11:00 AM - 11:50 AM",
  "MWF 1:00 PM - 1:50 PM",
  "TR 9:30 AM - 10:45 AM",
  "TR 11:00 AM - 12:15 PM",
  "TR 1:00 PM - 2:15 PM",
  "TR 2:30 PM - 3:45 PM",
];

const officeHours = [
  "Monday 1:00 PM - 3:00 PM",
  "Tuesday 2:00 PM - 4:00 PM",
  "Wednesday 10:00 AM - 12:00 PM",
  "Thursday 3:00 PM - 5:00 PM",
  "Friday 11:00 AM - 1:00 PM",
];

const assignmentTypes = [
  "Homework",
  "Programming Assignment",
  "Lab",
  "Project",
  "Quiz",
  "Worksheet",
  "Reading Assignment",
  "Practice Problems",
  "Research Paper",
  "Coding Exercise",
  "Discussion Post",
  "Exam",
];

const assignmentSubjects = [
  "Binary Trees",
  "Linked Lists",
  "Sorting Algorithms",
  "Graph Algorithms",
  "SQL Queries",
  "Database Design",
  "Network Packet Analysis",
  "Subnetting",
  "TCP/IP",
  "Routing",
  "Operating Systems",
  "Memory Management",
  "Process Scheduling",
  "Web Application",
  "REST API",
  "Machine Learning",
  "Neural Networks",
  "Cybersecurity",
  "Cryptography",
];

const noteContents = [
  "Remember to review lecture notes before Friday.",
  "Study for upcoming exam.",
  "Check professor's announcements.",
  "Finish outstanding assignments.",
  "Review notes from this week's lectures.",
  "Start working on upcoming project.",
  "Remember to submit everything before the deadline.",
  "Check OneNote for additional materials.",
];

// -------------------------
// Seed
// -------------------------

async function seed() {
  const client = await pool.connect();

  // Get user ID from command line
  const userId = Number(process.argv[2]);

  if (!userId) {
    console.error("Please provide a user ID.");
    console.error("Example: node seed.js 1");
    process.exit(1);
  }

  try {
    console.log(`Starting database seed for user ${userId}...`);

    await client.query("BEGIN");

    // -------------------------
    // Clear only this user's data
    // -------------------------

    await client.query(
      "DELETE FROM assignments WHERE user_id = $1",
      [userId],
    );

    await client.query(
      "DELETE FROM classes WHERE user_id = $1",
      [userId],
    );

    await client.query(
      "DELETE FROM semesters WHERE user_id = $1",
      [userId],
    );

    await client.query(
      "DELETE FROM notes WHERE user_id = $1",
      [userId],
    );

    // -------------------------
    // Semester
    // -------------------------

    const semester = randomItem(semesters);

    const semesterResult = await client.query(
      `
      INSERT INTO semesters
        (name, start_date, end_date, user_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id
      `,
      [
        semester.name,
        semester.startDate,
        semester.endDate,
        userId,
      ],
    );

    const semesterId = semesterResult.rows[0].id;

    console.log(`Created semester: ${semester.name}`);
    console.log(`Start date: ${semester.startDate}`);
    console.log(`End date: ${semester.endDate}`);

    // -------------------------
    // Classes
    // -------------------------

    const classIds = [];

    const numberOfClasses = randomInt(3, 6);

    const shuffledClasses = [...classNames].sort(
      () => Math.random() - 0.5,
    );

    // Check color column once instead of every loop
    const colorColumnExists = await client.query(`
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'classes'
        AND column_name = 'color'
      ) AS "hasColorColumn"
    `);

    const hasColorColumn =
      colorColumnExists.rows[0]?.hasColorColumn ?? false;

    for (let i = 0; i < numberOfClasses; i++) {
      const classColor = randomHexColor();

      const result = await client.query(
        hasColorColumn
          ? `
            INSERT INTO classes
              (
                name,
                course_code,
                professor,
                course_hours,
                office_hours,
                onenote_url,
                color,
                user_id
              )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id
          `
          : `
            INSERT INTO classes
              (
                name,
                course_code,
                professor,
                course_hours,
                office_hours,
                onenote_url,
                user_id
              )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
          `,
        hasColorColumn
          ? [
              shuffledClasses[i],
              courseCodes[i],
              randomItem(professors),
              randomItem(courseHours),
              randomItem(officeHours),
              "https://onenote.com/",
              classColor,
              userId,
            ]
          : [
              shuffledClasses[i],
              courseCodes[i],
              randomItem(professors),
              randomItem(courseHours),
              randomItem(officeHours),
              "https://onenote.com/",
              userId,
            ],
      );

      const classId = result.rows[0].id;

      classIds.push(classId);

      console.log(
        `Created class: ${shuffledClasses[i]} (${courseCodes[i]})`,
      );
    }

    // -------------------------
    // Assignments
    // -------------------------

    const numberOfAssignments = randomInt(8, 25);

    for (let i = 0; i < numberOfAssignments; i++) {
      const assignmentType = randomItem(assignmentTypes);
      const subject = randomItem(assignmentSubjects);

      const assignmentName =
        `${subject} ${assignmentType}`;

      const classId = randomItem(classIds);

      const priority = randomBool();
      const completed = randomBool();

      const dueDate = randomItem(weekdays);

      await client.query(
        `
        INSERT INTO assignments
          (
            class_id,
            name,
            priority,
            due_date,
            completed,
            user_id
          )
        VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [
          classId,
          assignmentName,
          priority,
          dueDate,
          completed,
          userId,
        ],
      );
    }

    console.log(
      `Created ${numberOfAssignments} assignments`,
    );

    // -------------------------
    // Notes
    // -------------------------

    const numberOfNoteLines = randomInt(3, 7);

    const shuffledNotes = [...noteContents].sort(
      () => Math.random() - 0.5,
    );

    const noteContent = shuffledNotes
      .slice(0, numberOfNoteLines)
      .join("\n");

    await client.query(
      `
      INSERT INTO notes
        (content, user_id)
      VALUES ($1, $2)
      `,
      [noteContent, userId],
    );

    console.log(
      `Created 1 notes row with ${numberOfNoteLines} lines`,
    );

    // -------------------------
    // Commit
    // -------------------------

    await client.query("COMMIT");

    console.log("");
    console.log("Database seeded successfully.");
    console.log("");
    console.log(`User ID: ${userId}`);
    console.log(`Semester ID: ${semesterId}`);
    console.log(`Semester: ${semester.name}`);
    console.log(`Start: ${semester.startDate}`);
    console.log(`End: ${semester.endDate}`);
    console.log(`Classes: ${numberOfClasses}`);
    console.log(`Assignments: ${numberOfAssignments}`);
    console.log(
      `Notes: ${numberOfNoteLines} lines`,
    );
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Seed failed:");
    console.error(error);

    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();