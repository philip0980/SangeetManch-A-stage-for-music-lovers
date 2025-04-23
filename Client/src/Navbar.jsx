import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // For navigation using React Router
import axios from "axios";
import { BASE_URL } from "./URLs";

const Navbar = ({ isLoggedIn, setIsLoggedIn, setSearchQuery }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(e.target.value);
    setSearchQuery(value);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const logoutOnly = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/v1/user/logout`);
      console.log(response);
      handleLogout();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav style={styles.navbar}>
      {/* Logo */}
      <div style={styles.logo}>
        <h1>
          <Link to="/"></Link>
        </h1>
      </div>

      {/* Search Bar */}
      <div style={styles.searchBar}>
        <input
          type="text"
          value={query}
          onChange={handleSearchChange}
          placeholder="Search by Song, Album, Genre"
          style={styles.searchInput}
        />
      </div>

      {/* Right Side: Login Button */}
      <div style={styles.rightSection}>
        {!isLoggedIn ? (
          <div>
            <Link to="/login" style={styles.loginLink}>
              Login
            </Link>
            <Link to="/register" style={{ margin: "10px" }}>
              Register
            </Link>
          </div>
        ) : (
          <div>
            <button onClick={logoutOnly} style={styles.loginLink}>
              Logout
            </button>
            <Link to="/profile" style={{ margin: "10px" }}>
              Profile
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1e1e2f",
    color: "#fff",
    width: "calc(100vw - 250px)",
    height: "12vh",
    boxSizing: "border-box",
    padding: "0 30px",
    borderBottom: "1px solid white",
  },
  logo: {
    fontSize: "1rem",
  },
  searchBar: {
    flex: 1, // This makes the search bar grow to take up available space
    display: "flex",
    justifyContent: "center",
    height: "50px",
  },
  searchInput: {
    width: "60%",
    padding: "5px 10px",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
  },
  loginLink: {
    color: "#fff",
    textDecoration: "none",
    padding: "5px 10px",
    backgroundColor: "#007BFF",
    borderRadius: "5px",
  },
};

export default Navbar;
