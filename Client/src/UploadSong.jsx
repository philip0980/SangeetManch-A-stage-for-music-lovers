import React, { useState } from "react";
import axios from "axios";

const UploadSong = () => {
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    album: "",
    genre: "",
    duration: "",
    file: null,
    coverImageUrl: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      file: e.target.files[0],
    }));
  };

  const handleCoverImageChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      coverImageUrl: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, artist, album, genre, duration, file, coverImageUrl } =
      formData;
    const token = localStorage.getItem("token");

    const data = new FormData();
    data.append("title", title);
    data.append("artist", artist);
    data.append("album", album);
    data.append("genre", genre);
    data.append("duration", duration);
    data.append("fileUrl", file);
    data.append("coverImageUrl", coverImageUrl);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/song/upload",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Error uploading song");
      console.error("Error uploading song:", error);
    }
  };

  return (
    <div>
      <h1>Upload Song</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Song Title"
          required
        />
        <input
          type="text"
          name="artist"
          value={formData.artist}
          onChange={handleChange}
          placeholder="Artist"
          required
        />
        <input
          type="text"
          name="album"
          value={formData.album}
          onChange={handleChange}
          placeholder="Album"
          required
        />
        <input
          type="text"
          name="genre"
          value={formData.genre}
          onChange={handleChange}
          placeholder="Genre"
          required
        />
        <input
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          placeholder="Duration (in seconds)"
          required
        />
        <label htmlFor="audio">Audio</label>
        <input
          type="file"
          name="file"
          onChange={handleFileChange}
          accept="audio/*"
          required
        />
        <label htmlFor="coverImage">Cover Image</label>
        <input
          type="file"
          name="coverImageUrl"
          onChange={handleCoverImageChange}
          accept="image/*"
        />
        <button type="submit">Upload Song</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadSong;
