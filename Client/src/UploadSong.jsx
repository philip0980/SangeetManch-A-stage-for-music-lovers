import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "./URLs";

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
        `${BASE_URL}/api/v1/song/upload`,
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

  // INLINE STYLES
  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    marginTop: "-80px",
  };

  const formStyle = {
    // backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    background: "linear-gradient(to right,rgb(185, 190, 215),rgb(41, 29, 52))",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "450px",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    backgroundColor: "#667eea",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
  };

  const headingStyle = {
    fontSize: "28px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  };

  const labelStyle = {
    fontSize: "14px",
    marginBottom: "5px",
    color: "#555",
    display: "block",
  };

  const messageStyle = {
    marginTop: "20px",
    textAlign: "center",
    color: "green",
    fontWeight: "bold",
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h1 style={headingStyle}>Upload a Song</h1>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Song Title"
          required
          style={inputStyle}
        />

        <input
          type="text"
          name="artist"
          value={formData.artist}
          onChange={handleChange}
          placeholder="Artist"
          required
          style={inputStyle}
        />

        <input
          type="text"
          name="album"
          value={formData.album}
          onChange={handleChange}
          placeholder="Album"
          required
          style={inputStyle}
        />

        <input
          type="text"
          name="genre"
          value={formData.genre}
          onChange={handleChange}
          placeholder="Genre"
          required
          style={inputStyle}
        />

        <input
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          placeholder="Duration (seconds)"
          required
          style={inputStyle}
        />

        <div>
          <label style={labelStyle}>Audio File:</label>
          <input
            type="file"
            name="file"
            onChange={handleFileChange}
            accept="audio/*"
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Cover Image:</label>
          <input
            type="file"
            name="coverImageUrl"
            onChange={handleCoverImageChange}
            accept="image/*"
            style={inputStyle}
          />
        </div>

        <button type="submit" style={buttonStyle}>
          Upload Song
        </button>

        {message && <p style={messageStyle}>{message}</p>}
      </form>
    </div>
  );
};

export default UploadSong;
