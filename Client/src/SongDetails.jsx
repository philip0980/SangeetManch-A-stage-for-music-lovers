// SongDetailsPage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const SongDetailsPage = () => {
  const { id } = useParams();
  const [songDetails, setSongDetails] = useState(null);
  const [song, setSong] = useState();

  useEffect(() => {
    const fetchSongDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/song/stream/${id}`
        );
        setSongDetails(response.data.song); // Assuming the response has the song details
        setSong(response.data.song.fileUrl); // Set the song URL for playback
        console.log(response.data.song.fileUrl);
      } catch (error) {
        console.error("Error fetching song details", error);
      }
    };

    fetchSongDetails();
  }, [id]);

  if (!songDetails) {
    return <div>Loading...</div>;
  }

  localStorage.setItem("currentSong", song);

  return (
    <div style={styles.pageContainer}>
      <h2>Song Details</h2>
      <img
        src={songDetails.coverImageUrl}
        alt={songDetails.title}
        style={styles.coverImage}
      />
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
  playPauseButton: {
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "5px",
  },
};

export default SongDetailsPage;
