import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const SongDetailsPage = () => {
  const { id } = useParams();
  const [songDetails, setSongDetails] = useState(null);
  const [song, setSong] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedSong, setUpdatedSong] = useState({
    title: "",
    artist: "",
    album: "",
    genre: "",
    duration: "",
  });

  useEffect(() => {
    const fetchSongDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/song/stream/${id}`
        );
        setSongDetails(response.data.song);
        setSong(response.data.song.fileUrl); // Set the song URL for playback
        setUpdatedSong({
          title: response.data.song.title,
          artist: response.data.song.artist,
          album: response.data.song.album,
          genre: response.data.song.genre,
          duration: response.data.song.duration,
        });
      } catch (error) {
        console.error("Error fetching song details", error);
      }
    };

    fetchSongDetails();
  }, [id]);

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdatedSong((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    console.log("Updated Song Payload:", updatedSong); // Check the data being sent

    try {
      const token = localStorage.getItem("token");

      const response = await axios.patch(
        `http://localhost:8000/api/v1/song/patch/${id}`,
        updatedSong, // Send the updated song details
        {
          headers: {
            Authorization: `Bearer ${token}`, // Ensure that the token is passed
            "Content-Type": "application/json", // Ensure it's the correct content type
          },
        }
      );

      console.log("Response from Backend:", response); // Log the response to check the data

      // Update the song details state with the new data after successful update
      setSongDetails(response.data.song);
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error("Error updating song details", error);
    }
  };

  if (!songDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.pageContainer}>
      <h2>Song Details</h2>
      <img
        src={songDetails.coverImageUrl}
        alt={songDetails.title}
        style={styles.coverImage}
      />
      <button
        onClick={() => setIsEditing(!isEditing)}
        style={styles.updateButton}
      >
        {isEditing ? "Cancel" : "Edit"}
      </button>

      {isEditing ? (
        <form onSubmit={handleUpdateSubmit} style={styles.form}>
          <label>
            Title:
            <input
              type="text"
              name="title"
              value={updatedSong.title}
              onChange={handleUpdateChange}
              required
            />
          </label>
          <label>
            Artist:
            <input
              type="text"
              name="artist"
              value={updatedSong.artist}
              onChange={handleUpdateChange}
              required
            />
          </label>
          <label>
            Album:
            <input
              type="text"
              name="album"
              value={updatedSong.album}
              onChange={handleUpdateChange}
              required
            />
          </label>
          <label>
            Genre:
            <input
              type="text"
              name="genre"
              value={updatedSong.genre}
              onChange={handleUpdateChange}
              required
            />
          </label>
          <label>
            Duration (seconds):
            <input
              type="number"
              name="duration"
              value={updatedSong.duration}
              onChange={handleUpdateChange}
              required
            />
          </label>
          <button type="submit" style={styles.submitButton}>
            Save Changes
          </button>
        </form>
      ) : (
        <div style={styles.details}>
          <h3>{songDetails.title}</h3>
          <p>
            <strong>Genre:</strong> {songDetails.genre}
          </p>
          <p>
            <strong>Artist:</strong> {songDetails.artist}
          </p>
          <p>
            <strong>Album:</strong> {songDetails.album}
          </p>
          <p>
            <strong>Duration:</strong> {songDetails.duration} seconds
          </p>
        </div>
      )}

      {/* Audio Player */}
      <div style={styles.audioPlayerContainer}>
        <audio controls style={styles.audioPlayer}>
          <source src={song} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    padding: "20px",
    textAlign: "center",
  },
  coverImage: {
    width: "300px",
    height: "auto",
    marginBottom: "20px",
  },
  updateButton: {
    backgroundColor: "#28a745", // Green button for editing
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "5px",
    marginBottom: "20px",
  },
  form: {
    textAlign: "left",
    maxWidth: "500px",
    margin: "0 auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  },
  details: {
    marginTop: "20px",
  },
  submitButton: {
    backgroundColor: "#007BFF", // Blue button for submitting
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "5px",
    marginTop: "10px",
  },
  audioPlayerContainer: {
    marginTop: "20px",
  },
  audioPlayer: {
    width: "100%",
    maxWidth: "500px",
  },
};

export default SongDetailsPage;
