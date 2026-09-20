import pg from "pg";

const client = new pg.Client({
  host: "127.0.0.1",
  port: 5433,
  user: "dialisis_user",
  password: "dialisis_pass",
  database: "centro_dialisis",
});

try {
  await client.connect();
  console.log("✅ Conexión exitosa");
  const res = await client.query("SELECT current_user, current_database()");
  console.log(res.rows);
} catch (err) {
  console.error("❌ Error real de Postgres:", err.message);
} finally {
  await client.end();
}
