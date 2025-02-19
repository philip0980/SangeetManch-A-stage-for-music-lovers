import React, { useState, useEffect } from "react";
import axios from "axios";

const CreatePlaylist = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [songs, setSongs] = useState([]); // List of selected song IDs
  const [allSongs, setAllSongs] = useState([]); // All available songs to choose from
  const [error, setError] = useState(""); // To handle errors
  const [successMessage, setSuccessMessage] = useState(""); // Success message

  useEffect(() => {
    fetchSongs(); // Fetch songs when the component mounts
  }, []);

  // Fetch all available songs from the backend
  const fetchSongs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/song/all-songs"
      );
      setAllSongs(response.data.songs); // Populate the song list
    } catch (error) {
      console.error("Error fetching songs", error);
    }
  };

  const handleSongSelection = (songId) => {
    // Add or remove songs from the selection
    if (songs.includes(songId)) {
      setSongs(songs.filter((id) => id !== songId)); // Remove song if already selected
    } else {
      setSongs([...songs, songId]); // Add song to selected list
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the playlist name, description, and songs are valid
    if (!name || !description || songs.length < 2) {
      setError("Please provide a name, description, and at least 2 songs.");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // Assuming user is logged in and token is stored in localStorage
      const response = await axios.post(
        "http://localhost:8000/api/v1/playlist/create",
        { name, description, songs },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage("Playlist created successfully!");
      setName(""); // Clear the form fields
      setDescription("");
      setSongs([]);
    } catch (error) {
      console.error("Error creating playlist", error);
      setError("Error creating playlist. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Create Playlist</h2>
      {error && <div style={styles.error}>{error}</div>}
      {successMessage && <div style={styles.success}>{successMessage}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label htmlFor="name">Playlist Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={styles.textarea}
          />
        </div>

        <div style={styles.songSelection}>
          <h3>Select Songs</h3>
          <div style={styles.songList}>
            {allSongs.map((song) => (
              <div key={song._id} style={styles.songItem}>
                <input
                  type="checkbox"
                  id={`song-${song._id}`}
                  checked={songs.includes(song._id)}
                  onChange={() => handleSongSelection(song._id)}
                />
                <label htmlFor={`song-${song._id}`} style={styles.songLabel}>
                  {song.title}
                </label>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" style={styles.submitButton}>
          Create Playlist
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px 20px 120px 20px",
    maxWidth: "600px",
    margin: "auto",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "10px",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  textarea: {
    padding: "10px",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "5px",
    height: "100px",
  },
  songSelection: {
    marginTop: "20px",
  },
  songList: {
    maxHeight: "200px",
    overflowY: "scroll",
    border: "1px solid #ccc",
    padding: "10px",
    borderRadius: "5px",
  },
  songItem: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  },
  songLabel: {
    marginLeft: "10px",
  },
  submitButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  error: {
    color: "red",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  success: {
    color: "green",
    fontWeight: "bold",
    marginBottom: "10px",
  },
};

export default CreatePlaylist;
