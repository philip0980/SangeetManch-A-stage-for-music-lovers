import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ handleLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        {
          email: email,
          password: password,
        }
      );

      if (response.status === 200 && response.data && response.data.token) {
        console.log("Login successful", response.data);
      }
    } catch (error) {
      console.error("Login error", error);
      setError("Invalid email or password . Please try again");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <label htmlFor="Email">Email </label>
        <input
          type="email"
          placeholder="hello@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />{" "}
        <br />
        <label htmlFor="Password">Password </label>
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        {loading ? "Logging in..." : ""}
      </form>
    </div>
  );
};

export default Login;
