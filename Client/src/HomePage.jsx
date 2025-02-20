import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const HomePage = ({ searchQuery }) => {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);

  useEffect(() => {
    fetchSongs();
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
      const response = await axios.get(
        "http://localhost:8000/api/v1/song/all-songs"
      );
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

  return (
    <div style={styles.container}>
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
  );
};

const styles = {
  container: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: "20px",
    gap: "20px",
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
  list: {
    border: "1px solid green",
    borderRadius: "5px",
  },
};

export default HomePage;
