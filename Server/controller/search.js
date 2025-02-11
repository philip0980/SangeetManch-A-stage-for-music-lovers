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

export { songSearch, playlistSearch };
