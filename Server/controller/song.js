import cloudinary from "cloudinary";
import Song from "../models/song.js";

const UploadSong = async (req, res) => {
  const { title, artist, album, genre, duration } = req.body;
  const userId = req.user._id;

  if (!req.files?.fileUrl || !req.files?.coverImageUrl) {
    return res
      .status(400)
      .json({ message: "Both song file and cover image are required." });
  }

  try {
    const fileUploadResult = await cloudinary.v2.uploader.upload(
      req.files.fileUrl[0].path,
      {
        folder: "songs",
        resource_type: "auto",
      }
    );

    const coverImageUploadResult = await cloudinary.v2.uploader.upload(
      req.files.coverImageUrl[0].path,
      {
        folder: "coverImages",
        resource_type: "image",
      }
    );

    const newSong = new Song({
      title,
      artist,
      album,
      genre,
      duration,
      fileUrl: fileUploadResult.secure_url,
      coverImageUrl: coverImageUploadResult.secure_url,
      userId,
    });

    await newSong.save();

    res.status(201).json({
      message: "Song added successfully",
      song: newSong,
    });
  } catch (error) {
    console.error("Error during song upload:", error);
    res.status(500).json({
      message: "Error adding song",
      error: error.message,
    });
  }
};

const DeleteSong = async (req, res) => {
  const { id } = req.params;
  try {
    const song = await Song.findById(id);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    const songFilePublicId = song.fileUrl
      ? song.fileUrl.split("/").pop().split(".")[0]
      : null;

    const coverImagePublicId = song.coverImageUrl
      ? song.coverImageUrl.split("/").pop().split(".")[0]
      : null;

    if (songFilePublicId) {
      await cloudinary.v2.uploader.destroy(songFilePublicId, {
        resource_type: "raw",
      });
    }

    if (coverImagePublicId) {
      await cloudinary.v2.uploader.destroy(coverImagePublicId, {
        resource_type: "image",
      });
    }
    await song.deleteOne();

    return res
      .status(200)
      .json({ success: true, message: "Song deleted successfully" });
  } catch (error) {
    console.error("Error deleting song", error);
    return res.status(500).json({ message: "Error deleting song", error });
  }
};

const UpdateSong = async (req, res) => {
  const { id } = req.params;
  const { title, artist, album, genre, duration } = req.body;

  try {
    const song = await Song.findById(id);

    if (!song) {
      return res
        .status(404)
        .json({ success: false, message: "Song not found" });
    }

    if (title) song.title = title;
    if (artist) song.artist = artist;
    if (album) song.album = album;
    if (genre) song.genre = genre;
    if (duration) song.duration = duration;

    await song.save();

    return res.status(200).json({ message: "Song updated successfully", song });
  } catch (error) {
    console.error("Error updating song:", error);
    return res.status(500).json({ message: "Error updating song", error });
  }
};

const FetchSong = async (req, res) => {
  const { id } = req.params;

  try {
    const song = await Song.findById(id);

    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    return res.status(200).json({ song });
  } catch (error) {
    console.error("Error fetching song:", error);
    return res.status(500).json({ message: "Error fetching song", error });
  }
};

const FetchAllSongs = async (req, res) => {
  try {
    const songs = await Song.find();

    if (songs.length === 0) {
      return res.status(404).json({ message: "No songs found" });
    }

    return res.status(200).json({
      message: "Songs fetched successfully",
      songs,
    });
  } catch (error) {
    console.error("Error fetching songs:", error);
    return res.status(500).json({ message: "Error fetching songs", error });
  }
};

export { UploadSong, DeleteSong, UpdateSong, FetchSong, FetchAllSongs };
