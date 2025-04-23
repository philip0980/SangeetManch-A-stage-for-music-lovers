import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = ({ handleLogin, setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLocalLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
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
        handleLogin(response.data.token);
        setIsLocalLogin(true);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Login error", error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("Invalid email or password. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>
        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.inputGroup}>
          <label htmlFor="email" style={styles.label}>
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="password" style={styles.label}>
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={styles.footerText}>
          Don't have an account?
          <Link to="/register" style={styles.link}>
            {" "}
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

const styles = {
  pageWrapper: {
    minHeight: "70vh",
    background: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  card: {
    background: "rgba(0, 0, 0, 0.1)",
    // backdropFilter: "blur(5px)",
    // WebkitBackdropFilter: "blur(20px)", // for Safari
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "20px",
    padding: "40px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 8px 32px 0 rgba(255, 255, 255, 0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "2rem",
    fontWeight: "bold",
    color: "black",
  },
  error: {
    color: "#e74c3c",
    textAlign: "center",
    marginBottom: "15px",
  },
  inputGroup: {
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "8px",
    fontSize: "0.9rem",
    color: "black",
  },
  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    fontSize: "1rem",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    color: "black",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    backgroundColor: "#6c5ce7",
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: "1rem",
    border: "none",
    cursor: "pointer",
    marginTop: "10px",
    transition: "background 0.3s",
  },
  footerText: {
    marginTop: "20px",
    fontSize: "0.9rem",
    textAlign: "center",
    color: "black",
  },
  link: {
    color: "#6c5ce7",
    textDecoration: "none",
    marginLeft: "5px",
  },
};

export default Login;
