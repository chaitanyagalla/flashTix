import { pool } from "./pool.js";

async function testConnection() {
  try {
    const result = await pool.query(`
        SELECT 
        now() as database_time,
        CURRENT_DATABASE() as database_name,
        pg_backend_pid() as backend_pid 
        `);

     console.log("Full query result:");
    console.log(result);

    console.log("\nRows:");
    console.log(result.rows);

    console.log("\nFirst row:");
    console.log(result.rows[0]);

     console.log("\nPool:");
    console.log({
      totalConnections: pool.totalCount,
      idleConnections: pool.idleCount,
      waitingConnections: pool.waitingCount,
    });
  } catch (error) {
    console.error("Database connection failed:");
    console.log(error)
  } finally {
    await pool.end()
  }
}

testConnection()