import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Profile.css"; // Import CSS file for styling

const Profile = ({ handleLogout }) => {
  const [profile, setProfile] = useState({});
  const [mySongs, setMySongs] = useState([]);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);

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

  const deleteAccount = async () => {
    try {
      const response = await axios.delete(
        "http://localhost:8000/api/v1/user/delete-account",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { password }, // Send the password for verification
        }
      );
      if (response.status === 200) {
        setMessage("Account deleted successfully.");
        handleLogout();
        navigate("/"); // Redirect to logout or home page
      }
    } catch (error) {
      console.error("Error deleting account", error);
      setMessage("Failed to delete account. Please check your password.");
    }
  };

  const handleSongClick = (song) => {
    // Handle song click logic
  };

  const handleUpload = () => {
    navigate("/upload-song");
  };

  const handleChangePassword = () => {
    navigate("/change-password");
  };

  const handleDeleteAccount = () => {
    setShowModal(true);
  };

  const handleCancelModal = () => {
    setShowModal(false); // Close the modal
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          <h2 style={{ fontSize: "28px", color: "#333", margin: "0" }}>
            Your Songs
          </h2>

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button
              style={{
                backgroundColor: "#e74c3c",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                fontSize: "16px",
                cursor: "pointer",
                height: "40px",
                minWidth: "120px",
              }}
              onClick={handleUpload}
            >
              Upload
            </button>

            <button
              style={{
                backgroundColor: "#3498db",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                fontSize: "16px",
                cursor: "pointer",
                height: "40px",
                minWidth: "160px",
              }}
              onClick={handleChangePassword}
            >
              Change Password
            </button>

            <button
              style={{
                backgroundColor: "#e67e22",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                fontSize: "16px",
                cursor: "pointer",
                height: "40px",
                minWidth: "140px",
              }}
              onClick={handleDeleteAccount}
            >
              Delete Account
            </button>
          </div>
        </div>

        {showModal && (
          <div
            className="modal"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              className="modal-content"
              style={{
                backgroundColor: "#fff",
                padding: "30px",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                width: "90%",
                maxWidth: "400px",
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  marginBottom: "20px",
                  fontSize: "22px",
                  color: "#333",
                }}
              >
                Confirm Account Deletion
              </h3>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "20px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  fontSize: "16px",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                }}
              >
                <button
                  onClick={deleteAccount}
                  style={{
                    flex: 1,
                    backgroundColor: "#e74c3c",
                    color: "#fff",
                    padding: "10px",
                    border: "none",
                    borderRadius: "5px",
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
                <button
                  onClick={handleCancelModal}
                  style={{
                    flex: 1,
                    backgroundColor: "#2ecc71",
                    color: "#fff",
                    padding: "10px",
                    border: "none",
                    borderRadius: "5px",
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

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
