import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BASE_URL } from "./URLs";

const token = localStorage.getItem("token");

const Dashboard = () => {
  const { id } = useParams();
  const [users, setUser] = useState([]);
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const user = async () => {
      if (!token) {
        throw new Error("No token found");
      }
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/user/all-users`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setUser(response.data.users);
      } catch (error) {
        console.log(error);
      }
    };

    user();
    song();
    playlist();
  }, []);

  const song = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/song/all-songs`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setSongs(response.data.songs);
    } catch (error) {
      console.log(error);
    }
  };

  const playlist = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v1/playlist/find-playlist`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      const playlistsData = response.data.playlist;
      const playlistsWithSongs = await Promise.all(
        playlistsData.map(async (playlist) => {
          const songs = await Promise.all(
            playlist.songs.map(async (songId) => {
              const songDetails = await fetchSongDetails(songId);
              return songDetails;
            })
          );
          return { ...playlist, songs };
        })
      );
      setPlaylists(playlistsWithSongs);
    } catch (error) {
      console.log(error);
    }
  };

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
      return response.data.song;
    } catch (error) {
      console.error("Error fetching song details", error);
      return null;
    }
  };

  const cardStyle = {
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "15px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
    backgroundColor: "#fff",
    transition: "transform 0.2s",
  };

  const imageStyle = {
    height: "100px",
    width: "100px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "10px",
  };

  const containerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: "20px",
    marginBottom: "50px",
  };

  const sectionTitleStyle = {
    margin: "30px 0 10px",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
      <h2 style={sectionTitleStyle}>Users</h2>
      <div style={containerStyle}>
        {users.map((user) => (
          <Link
            key={user._id}
            to={`/user/${user._id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div style={{ ...cardStyle, cursor: "pointer" }}>
              <img src={user.avatar.url} alt="avatar" style={imageStyle} />
              <p>{user.name}</p>
            </div>
          </Link>
        ))}
      </div>

      <h2 style={sectionTitleStyle}>Songs</h2>
      <div style={containerStyle}>
        {songs.map((song) => (
          <Link
            key={song._id}
            to={`/song/${song._id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div style={{ ...cardStyle, cursor: "pointer" }}>
              <img src={song.coverImageUrl} alt="cover" style={imageStyle} />
              <p>{song.title}</p>
            </div>
          </Link>
        ))}
      </div>

      <h2 style={sectionTitleStyle}>Playlists</h2>
      <div style={containerStyle}>
        {playlists.map((playlist) => (
          <Link
            key={playlist._id}
            to={`/playlist-contain/${playlist._id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div style={{ ...cardStyle, cursor: "pointer" }}>
              <p style={{ fontWeight: "bold", fontSize: "18px" }}>
                {playlist.name}
              </p>
              <p style={{ fontSize: "14px", color: "#666" }}>
                {playlist.description}
              </p>
              <h4 style={{ marginTop: "10px" }}>Songs:</h4>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "5px",
                  justifyContent: "center",
                }}
              >
                {playlist.songs.map((song) => (
                  <div key={song._id}>
                    <img
                      src={song.coverImageUrl}
                      alt="song-cover"
                      style={{
                        height: "50px",
                        width: "50px",
                        borderRadius: "8px",
                      }}
                    />
                    <p style={{ fontSize: "12px", marginTop: "5px" }}>
                      {song.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
