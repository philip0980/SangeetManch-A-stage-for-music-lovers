import Playlist from "../models/playlist.js";
import Song from "../models/song.js";

const CreatePlaylist = async (req, res) => {
  const { name, description, songs } = req.body;
  const userId = req.params._id;

  if (!songs || songs.length < 2) {
    return res.status(400).json({
      message: "A playlist must have at least 2 songs",
    });
  }

  try {
    const validateSongs = await Song.find({ _id: { $in: songs } });

    if (validateSongs.length !== songs.length) {
      return res.status(404).json({
        message: "Some of the song IDs are invalid or do not exist.",
      });
    }

    const playlist = new Playlist({
      name,
      description,
      userId,
      songs,
    });

    await playlist.save();
    return res.status(201).json({
      message: "Playlist created successfully",
      playlist,
    });
  } catch (error) {
    console.error("Error creating playlist:", error);
    return res.status(500).json({
      message: "Error creating playlist",
      error: error.message,
    });
  }
};

const EditPlaylist = async (req, res) => {
  const [name, description] = req.body;
  const playlistId = req.params._id;
  if (!name || !description) {
    return res.status(400).json({ message: "Name or description is required" });
  }
  try {
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    if (playlist.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to edit this playlist",
      });
    }

    playlist.name = name || playlist.name;
    playlist.description = description || playlist.description;

    await playlist.save();

    return res
      .status(200)
      .json({ message: "Playlist updated successfully", playlist });
  } catch (error) {
    console.error("Error updating playlist:", error);
    return res
      .status(500)
      .json({ message: "Error updating playlist", error: error.message });
  }
};

const DeletePlaylist = async (req, res) => {
  const { id } = req.params;
  try {
    const playlist = await Playlist.find(id);

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    if (playlist.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this playlist",
      });
    }

    await playlist.deleteOne();

    return res.status(200).json({ message: "Playlist deleted successfully" });
  } catch (error) {
    console.error("Error deleting playlist:", error);
    return res.status(500).json({
      message: "Error deleting playlist",
      error: error.message,
    });
  }
};

const AddSong = async (req, res) => {
  const { playlistId } = req.params;
  const { songId } = req.body;

  try {
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    const song = await Song.findById(songId);

    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    if (playlist.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to add songs to this playlist",
      });
    }

    if (playlist.songs.includes(songId)) {
      return res
        .status(400)
        .json({ message: "Song is already in the playlist" });
    }

    playlist.songs.push(songId);

    await playlist.save();

    return res
      .status(200)
      .json({ message: "Song added to playlist successfully", playlist });
  } catch (error) {
    console.error("Error adding song to playlist:", error);
    return res
      .status(500)
      .json({ message: "Error adding song to playlist", error: error.message });
  }
};

const removeSongFromPlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { songId } = req.body;

  try {
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    if (!playlist.songs.includes(songId)) {
      return res
        .status(404)
        .json({ message: "Song not found in the playlist" });
    }

    playlist.songs = playlist.songs.filter((id) => id.toString() !== songId);

    await playlist.save();

    return res
      .status(200)
      .json({ message: "Song removed from playlist", playlist });
  } catch (error) {
    console.error("Error removing song from playlist:", error);
    return res.status(500).json({
      message: "Error removing song from playlist",
      error: error.message,
    });
  }
};

const reorderSongsInPlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { songOrder } = req.body;

  try {
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    if (playlist.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to reorder songs in this playlist",
      });
    }

    const validSongIds = playlist.songs.map((id) => id.toString());
    const isValidOrder = songOrder.every((songId) =>
      validSongIds.includes(songId)
    );

    if (!isValidOrder) {
      return res.status(400).json({
        message: "Some songs in the order do not exist in the playlist",
      });
    }

    playlist.songs = songOrder;

    await playlist.save();

    return res
      .status(200)
      .json({ message: "Playlist reordered successfully", playlist });
  } catch (error) {
    console.error("Error reordering songs in playlist:", error);
    return res.status(500).json({
      message: "Error reordering songs in playlist",
      error: error.message,
    });
  }
};

export {
  CreatePlaylist,
  EditPlaylist,
  DeletePlaylist,
  AddSong,
  removeSongFromPlaylist,
  reorderSongsInPlaylist,
};
