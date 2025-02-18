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
    <>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <input
          type="password"
          name="cpassword"
          value={formData.cpassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          required
        />

        <input type="file" name="avatar" onChange={handleFileChange} />
        <input type="submit" value="Register" />
      </form>
    </>
  );
};

export default Register;
