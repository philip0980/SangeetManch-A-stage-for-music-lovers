import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BASE_URL } from "./URLs";

const HomePage = ({ searchQuery }) => {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [isMobileView, setIsMobileView] = useState(false); // State to track mobile view

  useEffect(() => {
    fetchSongs();
    checkMobileView(); // Check mobile view on initial load
    window.addEventListener("resize", checkMobileView); // Add event listener for resize
    return () => {
      window.removeEventListener("resize", checkMobileView); // Clean up on unmount
    };
  }, []);

  useEffect(() => {
    if (searchQuery) {
      filterSongs(searchQuery);
    } else {
      setFilteredSongs(songs);
    }
  }, [searchQuery, songs]);

  const fetchSongs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/song/all-songs`);
      setSongs(response.data.songs);
      setFilteredSongs(response.data.songs);
    } catch (error) {
      console.error("Error fetching songs", error);
    }
  };

  const filterSongs = (query) => {
    const lowerQuery = query.toLowerCase();
    const filtered = songs.filter(
      (song) =>
        song.title.toLowerCase().includes(lowerQuery) ||
        song.album.toLowerCase().includes(lowerQuery) ||
        song.genre.toLowerCase().includes(lowerQuery)
    );
    setFilteredSongs(filtered);
  };

  // Function to check if the view is mobile
  const checkMobileView = () => {
    setIsMobileView(window.innerWidth <= 768); // You can adjust this width as needed
  };

  return (
    <div style={styles.container}>
      {isMobileView && (
        <div style={styles.mobileWarningCard}>
          <p style={styles.mobileWarningText}>
            Not made for mobile view, download our app for a better experience.{" "}
            <br />
            <a
              href="https://github.com/philip0980/SangeetManch-A-stage-for-music-lovers/releases/download/v1.0.0/app-release.apk" // your app link here
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#00f", textDecoration: "underline" }}
            >
              Download 
            </a>
          </p>
        </div>
      )}
      {!isMobileView && (
        <div style={styles.songsContainer}>
          {filteredSongs.map((song) => (
            <div key={song._id} style={styles.songCard}>
              <Link to={`/song/${song._id}`}>
                <img
                  src={song.coverImageUrl}
                  alt={song.title}
                  style={styles.coverImage}
                />
                <div style={styles.textContainer}>
                  <div>
                    <p style={styles.title}>{song.title}</p>
                    <p style={styles.genre}>{song.genre}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: "relative",
    zIndex: 0,
  },
  mobileWarningCard: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Dark background to dim the content
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000, // Make sure it's on top of other content
    flexDirection: "column",
    color: "#fff",
    padding: "20px",
    boxSizing: "border-box",
  },
  mobileWarningText: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    textAlign: "center",
  },
  songsContainer: {
    display: "flex",
    flexWrap: "wrap", // <- This ensures the cards wrap properly
    justifyContent: "center",
    padding: "20px",
    gap: "20px",
    marginBottom: "100px",
    zIndex: 0, // Keeps song cards behind the mobile warning
  },
  songCard: {
    backgroundColor: "#333",
    borderRadius: "10px",
    overflow: "hidden",
    width: "250px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    transition: "transform 0.3s, box-shadow 0.3s",
    cursor: "pointer",
  },
  coverImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
  },
  textContainer: {
    padding: "15px",
    display: "flex",
    gap: "40px",
  },
  title: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#fff",
    margin: "0 0 10px",
  },
  genre: {
    fontSize: "1rem",
    color: "#ccc",
    margin: "0",
  },
};

export default HomePage;
