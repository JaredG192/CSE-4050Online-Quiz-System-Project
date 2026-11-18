const bcrypt = require("bcrypt");
const pool = require("./config/database");

async function seedUsers() {
  const studentPassword = await bcrypt.hash("student123", 10);
  const professorPassword = await bcrypt.hash("professor123", 10);

  await pool.execute(
    `INSERT INTO users (email, password_hash, role)
     VALUES (?, ?, ?), (?, ?, ?)
     ON DUPLICATE KEY UPDATE
       password_hash = VALUES(password_hash),
       role = VALUES(role)`,
    [
      "student@test.com",
      studentPassword,
      "student",
      "professor@test.com",
      professorPassword,
      "professor",
    ]
  );

  console.log("Test users added to MySQL.");
  await pool.end();
}

seedUsers().catch((error) => {
  console.error("Error adding users:", error);
  process.exit(1);
});