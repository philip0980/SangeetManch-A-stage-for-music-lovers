import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = ({ setIsLoggedIn }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
    avatar: null,
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.cpassword) {
      console.error("Passwords do not match!");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("cpassword", formData.cpassword);
    if (formData.avatar) {
      data.append("avatar", formData.avatar);
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/register",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        console.log(response.data);
        localStorage.setItem("token", response.data.token);
        setIsLoggedIn(true);
        navigate("/");
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      avatar: e.target.files[0],
    }));
  };

  return (
    <div style={styles.pageWrapper}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.title}>Create Your Account</h2>

        <div style={styles.inputGroup}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            style={styles.input}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            style={styles.input}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            style={styles.input}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <input
            type="password"
            name="cpassword"
            value={formData.cpassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            style={styles.input}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <input
            type="file"
            name="avatar"
            onChange={handleFileChange}
            style={styles.fileInput}
          />
        </div>

        <button type="submit" style={styles.button}>
          Register
        </button>
      </form>
    </div>
  );
};

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    background: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    marginTop: "-60px",
  },
  card: {
    background: "rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(5px)",
    WebkitBackdropFilter: "blur(15px)", // for Safari
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "16px",
    padding: "40px",
    width: "100%",
    maxWidth: "500px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#333",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    fontSize: "1rem",
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    color: "#333",
    outline: "none",
  },
  fileInput: {
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    fontSize: "1rem",
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "#333",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    backgroundColor: "#6c5ce7",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "1rem",
    border: "none",
    cursor: "pointer",
    marginTop: "10px",
  },
};

export default Register;
