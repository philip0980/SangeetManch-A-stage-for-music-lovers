import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./PlaylistContain.css"; // Importing CSS file
import { BASE_URL } from "./URLs";

const PlaylistContain = () => {
  const [playlist, setPlaylist] = useState(null);
  const [password, setPassword] = useState("");
  const [songs, setSongs] = useState([]);
  const [updatedPlaylist, setUpdatedPlaylist] = useState({
    name: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { id } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Function to fetch a song's details by its ID
  const fetchSongDetails = async (songId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v1/song/stream/${songId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.song; // Assuming the response contains a 'song' object
    } catch (error) {
      console.error("Error fetching song details", error);
      return null;
    }
  };

  // Function to fetch playlist details
  const searchSinglePlaylist = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v1/playlist/search-single-playlist/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const playlistData = response.data.playlist;
      setPlaylist(playlistData);
      setUpdatedPlaylist({
        name: playlistData.name,
        description: playlistData.description,
      });

      // Fetch song details for each song ID in the playlist
      const songDetailsPromises = playlistData.songs.map((songId) =>
        fetchSongDetails(songId)
      );
      const songsData = await Promise.all(songDetailsPromises);
      setSongs(songsData);
    } catch (error) {
      console.error("Error fetching playlist", error);
    }
  };

  useEffect(() => {
    searchSinglePlaylist();
  }, [id]); // Re-run the function if the playlist `id` changes

  if (!playlist || songs.length === 0) {
    return <div>Loading...</div>;
  }

  const handlePlay = (url) => {
    localStorage.setItem("currentSong", url);
    console.log(url);
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdatedPlaylist((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `${BASE_URL}/api/v1/playlist/edit/${id}`,
        updatedPlaylist,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setPlaylist(response.data.playlist);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating playlist details", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/v1/playlist/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        navigate("/");
      } else {
        console.error("Failed to delete playlist");
      }
    } catch (error) {
      console.error("Error deleting playlist details", error);
    }
  };

  const deleteFromPlaylist = async (songId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/playlist/remove-song/${id}`,
        { songId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setSongs(songs.filter((song) => song._id !== songId));
      }
    } catch (error) {
      console.error("Error deleting song from playlist", error);
    }
  };

  return (
    <div className="playlist-container">
      {isEditing ? (
        <form onSubmit={handleUpdateSubmit}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            name="name"
            value={updatedPlaylist.name}
            onChange={handleUpdateChange}
          />
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            name="description"
            value={updatedPlaylist.description}
            onChange={handleUpdateChange}
          />
          <button type="submit">Save Changes</button>
        </form>
      ) : (
        <div>
          <h1 className="playlist-title">{playlist.name}</h1>
          <p className="playlist-description">{playlist.description}</p>
        </div>
      )}

      <button
        style={{
          border: "1px solid black",
          backgroundColor: "green",
          height: "40px",
        }}
        onClick={() => setIsEditing(!isEditing)}
      >
        {isEditing ? "Cancel" : "Edit"}
      </button>
      <button
        style={{ backgroundColor: "red", marginLeft: "10px" }}
        onClick={() => setIsDeleting(!isDeleting)}
      >
        {isDeleting ? "Cancel" : "Delete"}
      </button>

      {isDeleting ? (
        <form onSubmit={handleDelete}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type your password here..."
          />
          <button type="submit">Delete</button>
        </form>
      ) : (
        ""
      )}

      <div className="songs-container">
        {songs.length > 0 ? (
          songs.map((song, index) => (
            <div
              className="song-card"
              key={index}
              onClick={() => handlePlay(song.fileUrl)}
            >
              <img
                className="song-cover"
                src={song.coverImageUrl}
                alt={song.title}
              />
              <div
                className="song-info"
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <h3 className="song-title">{song.title} || </h3>
                <p className="song-artist">{song.artist} || </p>
                <p className="song-album">{song.album}</p>
                <img
                  onClick={() => deleteFromPlaylist(song._id)}
                  src="../delete.png"
                  alt="delete"
                  height={40}
                  width={40}
                />
              </div>
            </div>
          ))
        ) : (
          <p>No songs in this playlist.</p>
        )}
      </div>
    </div>
  );
};

export default PlaylistContain;
