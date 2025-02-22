import React, { useState } from "react";
import axios from "axios"; // Don't forget to import axios

const ChangePassword = () => {
  const [oldPassword, setOldPass] = useState("");
  const [newPassword, setNewPass] = useState("");
  const [cNewPassword, setCNewPass] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit
    if (newPassword !== cNewPassword) {
      setError("New password and confirmation don't match!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/reset-password",
        {
          oldPassword,
          newPassword,
          cNewPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Fixed typo here
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setMessage("Password changed successfully");
        setError(""); // Clear any previous error
      }
    } catch (error) {
      console.log("Error changing password", error);
      setError("Failed to change password. Please try again.");
    }
  };

  return (
    <>
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Old Password"
          onChange={(e) => setOldPass(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          onChange={(e) => setNewPass(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          onChange={(e) => setCNewPass(e.target.value)}
        />
        {error && <div style={{ color: "red" }}>{error}</div>}
        {message && <div style={{ color: "green" }}>{message}</div>}
        <button type="submit">Change Password</button>
      </form>
    </>
  );
};

export default ChangePassword;
