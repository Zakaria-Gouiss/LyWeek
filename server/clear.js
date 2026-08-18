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

  const userId = Number(process.argv[2]);

  if (!userId) {
    console.error("Please provide a user ID.");
    console.error("Example: node clear.js 1");
    process.exit(1);
  }

  try {
    console.log(`Clearing data for user ${userId}...`);

    await client.query("BEGIN");

    // Delete only this user's data
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

    await client.query("COMMIT");

    console.log(
      `Database data for user ${userId} cleared successfully.`,
    );
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