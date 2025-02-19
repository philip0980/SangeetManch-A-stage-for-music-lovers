import Playlist from "../models/playlist.js";
import Song from "../models/song.js";

const songSearch = async (req, res) => {
  const { title, artist, genre } = req.query;

  try {
    const searchCriterial = {};

    if (title) {
      searchCriterial.title = { $regex: title, $options: "i" };
    }
    if (artist) {
      searchCriterial.artist = { $regex: artist, $options: "i" };
    }
    if (genre) {
      searchCriterial.genre = { $regex: genre, $options: "i" };
    }

    const songs = await Song.find(searchCriterial);

    return res.status(200).json({
      success: true,
      message: "Songs found successfully",
      songs,
    });
  } catch (error) {
    console.error("Error searching songs:", error);
    return res.status(500).json({
      success: false,
      message: "Error searching songs",
      error: error.message,
    });
  }
};

const playlistSearch = async (req, res) => {
  const { name, description } = req.query;
  try {
    const searchCriterial = {};

    if (name) {
      searchCriterial.name = { $regex: name, $options: "i" };
    }
    if (description) {
      searchCriterial.description = { $regex: description, $options: "i" };
    }

    const playlists = await Playlist.find(searchCriterial);

    return res.status(200).json({
      success: true,
      message: "Playlists found successfully",
      playlists,
    });
  } catch (error) {
    console.error("Error searching playlists:", error);
    return res.status(500).json({
      success: false,
      message: "Error searching playlists",
      error: error.message,
    });
  }
};

const mySongs = async (req, res) => {
  let userId;

  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    userId = req.user._id;

    const songs = await Song.find({ userId }).populate("userId", "name email");

    if (songs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No songs found for this user",
      });
    }

    return res.status(200).json({
      success: true,
      songs,
    });
  } catch (error) {
    console.error("Error fetching songs:", error.message); // Print the error message
    console.error(error.stack); // Log the full stack trace

    return res.status(500).json({
      success: false,
      message: "Error fetching songs",
      userId: userId || "User ID not defined", // Send userId or a fallback message
    });
  }
};

const myPlaylist = async (req, res) => {
  let userId;

  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    userId = req.user._id;

    const playlist = await Playlist.find({ userId }).populate(
      "userId",
      "name description songs"
    );

    if (playlist.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No songs found for this user",
      });
    }

    return res.status(200).json({
      success: true,
      playlist,
    });
  } catch (error) {
    console.error("Error fetching playlist:", error.message); // Print the error message
    console.error(error.stack); // Log the full stack trace

    return res.status(500).json({
      success: false,
      message: "Error fetching playlist",
      userId: userId || "User ID not defined", // Send userId or a fallback message
    });
  }
};

export { songSearch, playlistSearch, mySongs, myPlaylist };
