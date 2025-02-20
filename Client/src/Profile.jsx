import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Profile.css"; // Import CSS file for styling

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [mySongs, setMySongs] = useState([]);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const getData = async () => {
    if (!token) {
      throw new Error("No token found");
    }
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/user/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setProfile(response.data.user);
      setName(response.data.user.name); // Set name from profile
      setEmail(response.data.user.email); // Set email from profile
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const getMySongs = async () => {
    try {
      const anotherResponse = await axios.get(
        "http://localhost:8000/api/v1/song/my-song",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setMySongs(anotherResponse.data.songs);
    } catch (error) {
      console.error("Error fetching user songs", error);
    }
  };

  const updateProfile = async () => {
    try {
      const response = await axios.patch(
        "http://localhost:8000/api/v1/user/update-profile",
        { name, email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message);
      setIsEditing(false); // Hide the form after updating
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  useEffect(() => {
    getData();
    getMySongs();
  }, []);

  const handleSongClick = (song) => {
    // Handle song click logic
  };

  const handleUpload = () => {
    navigate("/upload-song");
  };

  return (
    <div className="profile-container">
      {message && <p className="message">{message}</p>}
      {/* 
      <div className="profile-header">
        <h1>Profile</h1>
      </div> */}

      <div className="profile-info">
        <div className="profile-image">
          {/* Conditionally render the profile avatar if available */}
          <img
            src={
              profile.avatar
                ? profile.avatar.url
                : "https://via.placeholder.com/250x200"
            }
            alt="Profile Avatar"
            width={250}
            height={200}
          />
          <button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? (
              <p onClick={() => setIsEditing(false)}>Cancel</p> // Clicking 'Cancel' will set isEditing to false
            ) : (
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-M-PNoZrf-mW_jbvvnAZ1BUA5Ws8H3zsGHEPghipKO5kY9jzTbIgtjhuJVCorVoUmqho&usqp=CAU"
                width={20}
                height={20}
                alt="Edit Icon"
              />
            )}
          </button>
        </div>

        <div className="profile-details">
          {isEditing ? (
            <div className="profile-edit-form">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
              <button onClick={updateProfile}>Save Changes</button>
            </div>
          ) : (
            <>
              <h2>{profile.name}</h2>
              <p>{profile.email}</p>
            </>
          )}
        </div>
      </div>

      <div className="songs-section">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>Your Songs</h2>
          <button
            style={{ backgroundColor: "red", height: "40px" }}
            onClick={handleUpload}
          >
            Upload
          </button>
        </div>
        <div className="songs-list">
          {mySongs.map((song) => (
            <div
              key={song._id}
              className="song-card"
              style={{
                display: "flex",
                width: "100%",
                flexWrap: "wrap",
                gap: "20px",
              }}
            >
              <Link
                to={`/song/${song._id}`}
                onClick={() => handleSongClick(song)}
              >
                <img
                  className="song-cover"
                  src={song.coverImageUrl}
                  alt={song.title}
                />
                <h3>{song.title}</h3>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
