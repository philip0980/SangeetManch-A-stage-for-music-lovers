import React from "react";
import { Link } from "react-router-dom"; // For navigation using React Router

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const handleLogout = () => {
    setIsLoggedIn(false);
  };
  return (
    <nav style={styles.navbar}>
      {/* Logo */}
      <div style={styles.logo}>
        <h1>MyApp</h1>
      </div>

      {/* Search Bar */}
      <div style={styles.searchBar}>
        <input type="text" placeholder="Search..." style={styles.searchInput} />
      </div>

      {/* Right Side: Login Button */}
      <div style={styles.rightSection}>
        {!isLoggedIn ? (
          <Link to="/login" style={styles.loginLink}>
            Login
          </Link>
        ) : (
          <div>
            <button onClick={handleLogout} style={styles.loginLink}>
              Logout
            </button>
            <Link to="/profile">Profile</Link>
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
    padding: "10px 20px",
    backgroundColor: "#333",
    color: "#fff",
  },
  logo: {
    fontSize: "1.5rem",
  },
  searchBar: {
    flex: 1, // This makes the search bar grow to take up available space
    display: "flex",
    justifyContent: "center",
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
