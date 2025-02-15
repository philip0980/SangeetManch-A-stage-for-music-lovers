import React, { createContext, useContext, useState, useEffect } from "react";

// Create Audio Context
const AudioContext = createContext();

export const useAudio = () => {
  return useContext(AudioContext);
};

export const AudioProvider = ({ children }) => {
  const [audioElement] = useState(new Audio()); // Initialize audio element only once
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);

  // Load stored song data from localStorage on component mount
  useEffect(() => {
    const storedSong = JSON.parse(localStorage.getItem("currentSong"));
    if (storedSong) {
      setCurrentSong(storedSong.song);
      setIsPlaying(storedSong.isPlaying);
      setCurrentTime(storedSong.currentTime);
    }
  }, []);

  // Play / Pause functionality with localStorage
  const playPause = async () => {
    try {
      if (isPlaying) {
        audioElement.pause(); // Pause audio if it's playing
        setIsPlaying(false);
      } else {
        // Ensure audio is ready to play
        await audioElement.play();
        setIsPlaying(true);
      }

      // Save play state to localStorage
      localStorage.setItem(
        "currentSong",
        JSON.stringify({
          song: currentSong,
          isPlaying: !isPlaying,
          currentTime: audioElement.currentTime,
        })
      );
    } catch (error) {
      console.log("Error during play/pause:", error);
    }
  };

  // Stop the song
  const stopSong = () => {
    audioElement.pause();
    audioElement.currentTime = 0; // Reset to the start of the song
    setIsPlaying(false);

    // Save stop state to localStorage
    localStorage.setItem(
      "currentSong",
      JSON.stringify({
        song: currentSong,
        isPlaying: false,
        currentTime: 0,
      })
    );
  };

  // Set the current song
  const setSong = async (song) => {
    try {
      if (currentSong !== song) {
        audioElement.src = song; // Load new song
        await audioElement.load(); // Ensure the new song is loaded
        await audioElement.play(); // Play the new song
        setCurrentSong(song);
        setIsPlaying(true);

        // Save song to localStorage
        localStorage.setItem(
          "currentSong",
          JSON.stringify({
            song,
            isPlaying: true,
            currentTime: 0,
          })
        );
      }
    } catch (error) {
      console.log("Error during song play:", error);
    }
  };

  // Track the audio progress and store in localStorage
  useEffect(() => {
    if (!audioElement) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audioElement.currentTime);
      localStorage.setItem(
        "currentSong",
        JSON.stringify({
          song: currentSong,
          isPlaying: isPlaying,
          currentTime: audioElement.currentTime,
        })
      );
    };

    // Attach timeupdate event listener
    audioElement.addEventListener("timeupdate", handleTimeUpdate);

    // Clean up event listener on component unmount or song change
    return () => {
      audioElement.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [audioElement, currentSong, isPlaying]);

  // Ensure we stop the audio when unmounting or changing song
  useEffect(() => {
    return () => {
      audioElement.pause();
      setIsPlaying(false);
    };
  }, [audioElement]);

  return (
    <AudioContext.Provider
      value={{
        currentSong,
        isPlaying,
        playPause,
        stopSong,
        setSong,
        currentTime,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
