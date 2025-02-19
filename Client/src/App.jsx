import React, { useEffect, useState, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./HomePage";
import Profile from "./Profile";
import Login from "./Login";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import SongDetails from "./SongDetails";
import axios from "axios";
import AudioPlayer from "./AudioPlayer";
import Register from "./Register";
import UploadSong from "./UploadSong";
import CreatePlaylist from "./CreatePlaylist";
import PlaylistContain from "./PlaylistContain";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [songs, setSongs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/song/all-songs"
      );
      setSongs(response.data.songs);
    } catch (error) {
      console.log("Error fetching songs", error);
    }
  };

  // Protected Route Wrapper
  const ProtectedRoute = ({ element }) => {
    return isLoggedIn ? element : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div style={styles.app_container}>
        <Sidebar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        <div style={styles.main_content}>
          <Navbar
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            onLogout={handleLogout}
            setSearchQuery={setSearchQuery}
          />
          <div style={styles.content_container}>
            <Routes>
              <Route
                path="/"
                element={<HomePage searchQuery={searchQuery} />}
              />
              <Route
                path="/register"
                element={<Register setIsLoggedIn={setIsLoggedIn} />}
              />
              <Route path="/upload-song" element={<UploadSong />} />
              <Route
                path="/login"
                element={
                  <Login
                    setIsLoggedIn={setIsLoggedIn}
                    handleLogin={handleLogin}
                  />
                }
              />
              <Route
                path="/profile"
                element={<ProtectedRoute element={<Profile />} />}
              />
              <Route path="/song/:id" element={<SongDetails />} />
              <Route
                path="/playlist-contain/:id"
                element={<PlaylistContain />}
              />
              <Route path="/create-playlist" element={<CreatePlaylist />} />
            </Routes>
          </div>
        </div>
        <AudioPlayer />
      </div>
    </Router>
  );
};

const styles = {
  app_container: {
    display: "flex",
    minHeight: "100vh",
  },
  main_content: {
    flex: 1,
    marginLeft: "250px", // Make space for the sidebar
    display: "flex",
    flexDirection: "column",
  },
  content_container: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
  },
};

export default App;
