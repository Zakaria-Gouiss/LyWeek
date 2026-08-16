require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function clearDatabase() {
  const client = await pool.connect();

  try {
    console.log("Clearing database...");

    await client.query("BEGIN");

    // Delete child tables first because of foreign keys
    await client.query("DELETE FROM assignments");
    await client.query("DELETE FROM classes");
    await client.query("DELETE FROM semesters");
    await client.query("DELETE FROM notes");

    // Reset IDs
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

    await client.query("COMMIT");

    console.log("Database cleared successfully.");
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Failed to clear database:");
    console.error(error);

    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

clearDatabase();