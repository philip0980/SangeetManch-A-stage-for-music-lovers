import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "./URLs";

const AddSongButton = ({ songId }) => {
  const [playlists, setPlaylists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch the user's playlists when the component mounts
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/v1/playlist/my-playlist`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setPlaylists(response.data.playlist);
      } catch (error) {
        console.error("Error fetching playlists", error);
      }
    };
    fetchPlaylists();
  }, [token]);

  const handleAddToPlaylist = async () => {
    if (!selectedPlaylist) {
      setMessage("Please select a playlist.");
      return;
    }

    try {
      const response = await axios.post(
        ` ${BASE_URL}/api/v1/playlist/add-song/${selectedPlaylist._id}`,
        { songId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setMessage("Song added to playlist successfully!");
        setShowModal(false); // Close modal after success
      }
    } catch (error) {
      console.error("Error adding song to playlist", error);
      setMessage("Error adding song to playlist.");
    }
  };

  console.log(songId);

  return (
    <>
      <img
        onClick={() => setShowModal(true)}
        style={{
          padding: 0,
          margin: 0,
        }}
        src="../add-list.png"
        alt="add-to-playlist"
        height={30}
        width={30}
      />

      {/* Modal */}
      {showModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3>Select a Playlist</h3>
            <ul style={styles.playlistList}>
              {playlists.map((playlist) => (
                <li
                  key={playlist._id}
                  style={styles.playlistItem}
                  onClick={() => setSelectedPlaylist(playlist)}
                >
                  {playlist.name}
                </li>
              ))}
            </ul>
            {selectedPlaylist && <p>Selected: {selectedPlaylist.name}</p>}
            <button onClick={handleAddToPlaylist}>Add Song</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
            {message && <p>{message}</p>}
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    width: "400px",
    textAlign: "center",
  },
  playlistList: {
    listStyle: "none",
    padding: 0,
  },
  playlistItem: {
    cursor: "pointer",
    padding: "10px",
    borderBottom: "1px solid #ccc",
    transition: "background-color 0.3s",
  },
  playlistItemHover: {
    backgroundColor: "#f0f0f0",
  },
};

export default AddSongButton;
