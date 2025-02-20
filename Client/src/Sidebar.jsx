import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // For navigation using React Router

const Sidebar = () => {
  const [playlist, setPlaylist] = useState([]);

  const getMyPlaylist = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      "http://localhost:8000/api/v1/playlist/my-playlist",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.data.playlist);
    setPlaylist(response.data.playlist);
  };

  useEffect(() => {
    getMyPlaylist();
  }, []);

  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>
        <p>
          <Link to="/">
            <img src="../logo2.png" alt="logo" width={60} height={60} />
          </Link>
        </p>
      </div>
      <hr style={{ marginBottom: "20px" }} />
      <div style={styles.navLinks}>
        <Link to="/" style={styles.link}>
          Home
        </Link>
        <Link to="/create-playlist" style={styles.link}>
          Create Playlist
        </Link>
      </div>
      <p style={{ textAlign: "center", marginTop: "3rem" }}>My Playlist</p>
      <hr />
      <div>
        {playlist.map((list) => (
          <div
            style={{
              border: "1px solid white",
              padding: "10px",
              lineHeight: "0.4",
              margin: "5px",
            }}
          >
            <Link to={`/playlist-contain/${list._id}`}>
              <h3>{list.name}</h3>
              <p>{list.description}</p>
            </Link>
          </div>
        ))}
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
    paddingBottom: "2px",
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
