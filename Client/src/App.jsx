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

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [songs, setSongs] = useState([]);

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
          />
          <div style={styles.content_container}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/register"
                element={<Register setIsLoggedIn={setIsLoggedIn} />}
              />
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
