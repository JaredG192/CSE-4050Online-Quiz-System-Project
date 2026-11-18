const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Temporary users for testing
const users = [
  {
    id: 1,
    email: "student@test.com",
    password: "student123",
    role: "student",
  },
  {
    id: 2,
    email: "professor@test.com",
    password: "professor123",
    role: "professor",
  },
];

// Test backend route
app.get("/api/health", (req, res) => {
  res.json({
    message: "Backend is running",
  });
});

// Temporary login route
app.post("/api/login", (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({
      message: "Email, password, and role are required.",
    });
  }

  const user = users.find(
    (user) =>
      user.email === email &&
      user.password === password &&
      user.role === role
  );

  if (!user) {
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
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});