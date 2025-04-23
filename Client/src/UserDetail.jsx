import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "./URLs";

const UserDetail = () => {
  const { id } = useParams();
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("");
  const [userDetail, setUserDetail] = useState({});
  const [userSongs, setUserSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    getSingleUser();
    getUserSongs();
  }, []);

  const getSingleUser = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v1/user/single-user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setUserDetail(response.data.user);
    } catch (error) {
      console.error(error);
    }
  };

  const getUserSongs = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v1/song/their-song/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setUserSongs(response.data.songs);
    } catch (error) {
      console.error(error);
    }
  };

  const suspendAccount = async () => {
    if (!reason || !duration) {
      alert("Please fill both reason and duration");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${BASE_URL}/api/v1/user/suspend/${id}`,
        { reason, duration },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      alert(`User suspended successfully for ${duration} days`);
      setReason("");
      setDuration("");
      getSingleUser();
    } catch (error) {
      console.error(error);
      alert("Failed to suspend account");
    } finally {
      setLoading(false);
    }
  };

  const banAccount = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${BASE_URL}/api/v1/user/ban/${id}`,
        { password },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      alert(`User banned successfully`);
      setPassword("");
      getSingleUser();
    } catch (error) {
      console.error(error);
      alert("Failed to ban account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>User Detail</h1>
      <div style={styles.card}>
        <img
          src={userDetail.avatar?.url || "https://via.placeholder.com/100"}
          alt="User Avatar"
          style={styles.avatar}
        />
        <h2 style={styles.name}>{userDetail.name}</h2>
        <p style={styles.email}>{userDetail.email}</p>
        <p style={styles.status}>
          <strong>Is Banned:</strong> {String(userDetail.isBanned)}
        </p>

        {/* Suspend Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Suspend Account</h3>
          <input
            type="text"
            placeholder="Reason for suspension"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Duration (days)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            style={styles.input}
          />{" "}
          <br />
          <button
            style={{ ...styles.button, backgroundColor: "#facc15" }}
            onClick={suspendAccount}
            disabled={loading}
          >
            {loading ? "Suspending..." : "Suspend"}
          </button>
        </div>

        {/* Ban Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Ban Account</h3>
          <input
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <button
            style={{ ...styles.button, backgroundColor: "#f87171" }}
            onClick={banAccount}
            disabled={loading}
          >
            {loading ? "Banning..." : "Ban"}
          </button>
        </div>

        {/* User Songs */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Uploaded Songs</h2>
          <div style={styles.songsContainer}>
            {userSongs.length === 0 ? (
              <p>User hasn't uploaded a song yet.</p>
            ) : (
              userSongs.map((song) => (
                <div key={song._id} style={styles.songCard}>
                  <img
                    src={
                      song.coverImageUrl || "https://via.placeholder.com/100"
                    }
                    alt={song.title}
                    style={styles.songImage}
                  />
                  <p style={styles.songTitle}>{song.title}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "20px",
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "2.5rem",
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  avatar: {
    borderRadius: "50%",
    width: "120px",
    height: "120px",
    objectFit: "cover",
    marginBottom: "20px",
  },
  name: {
    fontSize: "1.8rem",
    margin: "10px 0",
  },
  email: {
    fontSize: "1.1rem",
    color: "#555",
    marginBottom: "5px",
  },
  status: {
    fontSize: "1rem",
    color: "#777",
    marginBottom: "20px",
  },
  section: {
    marginTop: "30px",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    marginBottom: "15px",
  },
  input: {
    padding: "10px",
    margin: "8px 5px",
    width: "calc(50% - 10px)",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  button: {
    marginTop: "10px",
    padding: "12px 20px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "1rem",
    color: "#000",
    transition: "transform 0.2s",
  },
  songsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
    marginTop: "20px",
    marginBottom: "120px",
  },
  songCard: {
    width: "150px",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
    padding: "10px",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    transition: "transform 0.2s",
  },
  songImage: {
    width: "100%",
    height: "100px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  songTitle: {
    marginTop: "10px",
    fontSize: "1rem",
    color: "#333",
  },
};

export default UserDetail;
