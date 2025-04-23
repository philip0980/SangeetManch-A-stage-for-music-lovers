import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "./URLs";

const Sidebar = () => {
  const [playlist, setPlaylist] = useState([]);

  const getMyPlaylist = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${BASE_URL}/api/v1/playlist/my-playlist`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    setPlaylist(response.data.playlist);
  };

  useEffect(() => {
    getMyPlaylist();
  }, []);

  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>
        <Link to="/">
          <img src="../logo1.png" alt="Logo" style={styles.logoImage} />
        </Link>
      </div>
      <hr style={styles.hr} />
      <div style={styles.navLinks}>
        <Link to="/" style={styles.link}>
          Home
        </Link>
        <Link to="/create-playlist" style={styles.link}>
          Create Playlist
        </Link>
      </div>
      <p style={styles.playlistTitle}>My Playlists</p>
      <hr style={styles.hr} />
      <div style={styles.playlistContainer}>
        {playlist.map((list) => (
          <div key={list._id} style={styles.playlistItem}>
            <Link
              to={`/playlist-contain/${list._id}`}
              style={styles.playlistLink}
            >
              <h3 style={styles.playlistName}>{list.name}</h3>
              <p style={styles.playlistDesc}>{list.description}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "260px",
    height: "100vh",
    backgroundColor: "#1e1e2f",
    color: "#fff",
    padding: "20px 15px",
    boxSizing: "border-box",
    overflowY: "auto",
    borderRight: "1px solid #444",
    fontFamily: "'Poppins', sans-serif",
  },
  logo: {
    textAlign: "center",
    marginBottom: "20px",
  },
  logoImage: {
    width: "70px",
    height: "70px",
    objectFit: "contain",
    cursor: "pointer",
  },
  hr: {
    border: "none",
    height: "1px",
    backgroundColor: "#444",
    margin: "20px 0",
  },
  navLinks: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "30px",
  },
  link: {
    color: "#ccc",
    textDecoration: "none",
    padding: "12px",
    backgroundColor: "#2a2a3b",
    borderRadius: "8px",
    fontWeight: "500",
    transition: "all 0.3s ease",
  },
  playlistTitle: {
    textAlign: "center",
    margin: "25px 0 10px",
    fontSize: "18px",
    fontWeight: "bold",
    letterSpacing: "0.5px",
    color: "#aaa",
  },
  playlistContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  playlistItem: {
    backgroundColor: "#2a2a3b",
    padding: "12px",
    borderRadius: "8px",
    transition: "transform 0.2s",
    cursor: "pointer",
  },
  playlistLink: {
    textDecoration: "none",
    color: "inherit",
  },
  playlistName: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "600",
  },
  playlistDesc: {
    margin: "4px 0 0",
    fontSize: "13px",
    color: "#aaa",
  },
};

export default Sidebar;
