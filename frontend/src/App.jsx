import { useState } from "react";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [message, setMessage] = useState("");

  async function handleLogin(event) {
  event.preventDefault();

  if (!email || !password) {
    setMessage("Please enter your email and password.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5001/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        role,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message);
      return;
    }

    setMessage(`Welcome! You are logged in as a ${data.user.role}.`);
  } catch (error) {
    setMessage("Unable to connect to the backend.");
  }
}

  return (
    <main className="login-page">
      <section className="login-card">
        <img
          className="logo"
          src={`${import.meta.env.BASE_URL}images/coyote.png`}
          alt="Coyote logo"
        />

        <h1>QuizCoyote</h1>
        

        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <label htmlFor="role">Login as</label>
          <select
            id="role"
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            <option value="student">Student</option>
            <option value="professor">Professor</option>
          </select>

          <button type="submit">Log In</button>

          {message && <p className="message">{message}</p>}
        </form>
      </section>

      <footer className="footer">
        © 2026 QuizCoyote — CSE 4050 Class Project
      </footer>
    </main>
  );
}

export default App;