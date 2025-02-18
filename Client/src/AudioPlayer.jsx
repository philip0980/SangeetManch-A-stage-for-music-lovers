import React, { useState, useEffect } from "react";
import ReactAudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

const AudioPlayer = () => {
  const [songUrl, setSongUrl] = useState(null);

  const getItemFromLocalStorage = () => {
    const storedSong = localStorage.getItem("currentSong");
    if (storedSong) {
      setSongUrl(storedSong);
    }
  };

  useEffect(() => {
    getItemFromLocalStorage();

    const intervalId = setInterval(() => {
      getItemFromLocalStorage();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (songUrl) {
      localStorage.setItem("currentSong", songUrl);
    }
  }, [songUrl]);

  return (
    <div style={styles.playerContainer}>
      <ReactAudioPlayer
        src={songUrl}
        autoPlay={true}
        controls={true}
        onPlay={() => console.log("Playing")}
        onPause={() => console.log("Paused")}
        onEnded={() => console.log("Ended")}
        style={styles.audioPlayer}
      />
    </div>
  );
};

const styles = {
  playerContainer: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#181818", // Dark background similar to YouTube Music
    color: "#fff",
    padding: "15px 30px", // Added padding for a clean look
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.3)", // A stronger shadow effect for depth
    zIndex: 1000,
  },
  audioPlayer: {
    width: "100%",
    maxWidth: "700px", // Restrict max width for a balanced look
    backgroundColor: "#333", // Player background
    borderRadius: "8px", // Smooth corners for the player
    height: "80px", // Adjusted player height
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)", // Subtle shadow for depth
  },
  progressBar: {
    backgroundColor: "red", // Red color for the progress bar
  },
  playPauseButton: {
    fontSize: "30px", // Larger play/pause button
    padding: "10px 20px",
    backgroundColor: "#ff5733",
    color: "#fff",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
  },
  skipButton: {
    fontSize: "30px", // Larger skip button
    padding: "10px 20px",
    backgroundColor: "#ff5733",
    color: "#fff",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
  },
};

export default AudioPlayer;
