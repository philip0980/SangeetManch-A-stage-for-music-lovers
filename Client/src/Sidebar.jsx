import React from "react";
import { Link } from "react-router-dom"; // For navigation using React Router

const Sidebar = ({ isLoggedIn, handleLogout }) => {
  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>
        <h1>
          <Link to="/">Musify</Link>
        </h1>
      </div>
      <hr style={{ marginBottom: "20px" }} />
      <div style={styles.navLinks}>
        <Link to="/" style={styles.link}>
          Home
        </Link>
        <Link to="/profile" style={styles.link}>
          Profile
        </Link>
        {!isLoggedIn ? (
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        ) : (
          <button onClick={handleLogout} style={styles.link}>
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    position: "fixed", // Sidebar stays in place
    top: 0,
    left: 0,
    width: "250px", // Sidebar width
    height: "100%", // Full height
    backgroundColor: "#333",
    color: "#fff",
    padding: "20px",
    boxSizing: "border-box",
    overflowY: "auto", // Make sidebar scrollable if needed
    borderRight: "1px solid white",
  },
  logo: {
    fontSize: "0.5rem",
    marginBottom: "35px",
    textAlign: "center",
  },
  navLinks: {
    display: "flex",
    flexDirection: "column",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    marginBottom: "15px",
    padding: "10px",
    backgroundColor: "#444",
    borderRadius: "5px",
  },
};

export default Sidebar;
