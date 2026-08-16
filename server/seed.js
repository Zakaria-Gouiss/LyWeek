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
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
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

  try {
    console.log("Starting database seed...");

    await client.query("BEGIN");

    // -------------------------
    // Clear development data
    // -------------------------

    await client.query("DELETE FROM assignments");
    await client.query("DELETE FROM classes");
    await client.query("DELETE FROM semesters");
    await client.query("DELETE FROM notes");

    // -------------------------
    // Reset auto-increment IDs
    // -------------------------

    await client.query(
      "ALTER SEQUENCE assignments_id_seq RESTART WITH 1",
    );

    await client.query(
      "ALTER SEQUENCE classes_id_seq RESTART WITH 1",
    );

    await client.query(
      "ALTER SEQUENCE semesters_id_seq RESTART WITH 1",
    );

    await client.query(
      "ALTER SEQUENCE notes_id_seq RESTART WITH 1",
    );

    // -------------------------
    // Semester
    // -------------------------

    const semester = randomItem(semesters);

    const semesterResult = await client.query(
      `
      INSERT INTO semesters
        (name, start_date, end_date)
      VALUES ($1, $2, $3)
      RETURNING id
      `,
      [
        semester.name,
        semester.startDate,
        semester.endDate,
      ],
    );

    const semesterId = semesterResult.rows[0].id;

    console.log(
      `Created semester: ${semester.name}`,
    );

    console.log(
      `Start date: ${semester.startDate}`,
    );

    console.log(
      `End date: ${semester.endDate}`,
    );

    // -------------------------
    // Classes
    // -------------------------

    const classIds = [];

    const numberOfClasses = randomInt(4, 7);

    // Shuffle classes so different classes
    // are selected every time.
    const shuffledClasses = [...classNames].sort(
      () => Math.random() - 0.5,
    );

    for (let i = 0; i < numberOfClasses; i++) {
      const result = await client.query(
        `
        INSERT INTO classes
          (
            name,
            course_code,
            professor,
            course_hours,
            office_hours,
            onenote_url
          )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
        `,
        [
          shuffledClasses[i],
          courseCodes[i],
          randomItem(professors),
          randomItem(courseHours),
          randomItem(officeHours),
          "https://onenote.com/",
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

    const numberOfAssignments = randomInt(15, 30);

    for (let i = 0; i < numberOfAssignments; i++) {
      const assignmentType =
        randomItem(assignmentTypes);

      const subject =
        randomItem(assignmentSubjects);

      const assignmentName =
        `${subject} ${assignmentType}`;

      // Pick one of the classes that was
      // actually created above.
      const classId = randomItem(classIds);

      // Random true/false
      const priority = randomBool();

      // Random true/false
      const completed = randomBool();

      // Assignment due day is now a STRING.
      const dueDate = randomItem(weekdays);

      await client.query(
        `
        INSERT INTO assignments
          (
            class_id,
            name,
            priority,
            due_date,
            completed
          )
        VALUES ($1, $2, $3, $4, $5)
        `,
        [
          classId,
          assignmentName,
          priority,
          dueDate,
          completed,
        ],
      );
    }

    console.log(
      `Created ${numberOfAssignments} assignments`,
    );

    // -------------------------
    // Notes
    // -------------------------

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
    (content)
  VALUES ($1)
  `,
  [noteContent],
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
    console.log(`Semester ID: ${semesterId}`);
    console.log(`Semester: ${semester.name}`);
    console.log(`Start: ${semester.startDate}`);
    console.log(`End: ${semester.endDate}`);
    console.log(`Classes: ${numberOfClasses}`);
    console.log(`Assignments: ${numberOfAssignments}`);
    console.log(
  `Created 1 notes row with ${numberOfNoteLines} lines`,
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