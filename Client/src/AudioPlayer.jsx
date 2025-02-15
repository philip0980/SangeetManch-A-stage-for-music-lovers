import React from "react";
import { useAudio } from "./AudioContext";

const AudioPlayer = () => {
  const { currentSong, isPlaying, playPause, stopSong, currentTime } =
    useAudio();

  if (!currentSong) return null; // Don't render the player if no song is playing

  return (
    <div style={styles.audioPlayerContainer}>
      <div style={styles.audioPlayer}>
        <button onClick={playPause} style={styles.playPauseButton}>
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button onClick={stopSong} style={styles.stopButton}>
          Stop
        </button>
        <div>
          <progress
            value={currentTime}
            max={100}
            style={styles.progressBar}
          ></progress>
          <span>{Math.floor(currentTime)} / 100</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  audioPlayerContainer: {
    position: "fixed",
    bottom: 0,
    width: "100%",
    backgroundColor: "#333",
    color: "#fff",
    padding: "10px 20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 -4px 6px rgba(0, 0, 0, 0.2)",
  },
  audioPlayer: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  playPauseButton: {
    padding: "10px 20px",
    fontSize: "1.2rem",
    cursor: "pointer",
    backgroundColor: "#ff5733",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
  },
  stopButton: {
    padding: "10px 20px",
    fontSize: "1.2rem",
    cursor: "pointer",
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
  },
  progressBar: {
    width: "200px",
    height: "10px",
  },
};

export default AudioPlayer;
