const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
require("dotenv").config();

const pool = require("./config/database");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    message: "Backend is running",
  });
});

app.get("/api/db-test", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.json({
      message: "Database connection works",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({
      message: "Email, password, and role are required.",
    });
  }

  try {
    const [rows] = await pool.execute(
      "SELECT id, email, password_hash, role FROM users WHERE email = ? AND role = ?",
      [email, role]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email, password, or role.",
      });
    }

    const user = rows[0];

    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email, password, or role.",
      });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error during login.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});