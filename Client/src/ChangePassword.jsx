import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "./URLs";

const ChangePassword = () => {
  const [oldPassword, setOldPass] = useState("");
  const [newPassword, setNewPass] = useState("");
  const [cNewPassword, setCNewPass] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== cNewPassword) {
      setError("New password and confirmation don't match!");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/user/reset-password`,
        {
          oldPassword,
          newPassword,
          cNewPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setMessage("Password changed successfully!");
        setError("");
        setOldPass("");
        setNewPass("");
        setCNewPass("");
      }
    } catch (error) {
      console.log("Error changing password", error);
      setError("Failed to change password. Please try again.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        backgroundColor: "white",
        padding: "20px",
        marginTop: "-50px",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "380px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
            color: "#333",
          }}
        >
          Change Password
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPass(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPass(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={cNewPassword}
            onChange={(e) => setCNewPass(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
            required
          />

          {error && (
            <div style={{ color: "#e74c3c", textAlign: "center" }}>{error}</div>
          )}
          {message && (
            <div style={{ color: "#2ecc71", textAlign: "center" }}>
              {message}
            </div>
          )}

          <button
            type="submit"
            style={{
              marginTop: "10px",
              backgroundColor: "#3498db",
              color: "#fff",
              padding: "12px",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#2980b9")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#3498db")}
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
