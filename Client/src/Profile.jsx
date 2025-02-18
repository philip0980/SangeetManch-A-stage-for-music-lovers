import axios from "axios";
import React, { useEffect, useState } from "react";

const Profile = () => {
  const [profile, setProfile] = useState([]);
  const [mySongs, setMySongs] = useState([]);

  const getData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token found");
        console.log("No token found");
      }

      const response = await axios.get(
        "http://localhost:8000/api/v1/user/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      const anotherResponse = await axios.get(
        "http://localhost:8000/api/v1/song/my-song",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      console.log(anotherResponse.data);
      setMySongs(anotherResponse.data.songs);

      console.log(response.data);
      setProfile(response.data.user);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <h1>Profile</h1>
      <div>
        <img
          // src={profile.avatar.url}
          width={250}
          height={200}
        />
        <h2>{profile.name}</h2>
        <p>{profile.email}</p>
      </div>
      <div>
        <h1>Your songs</h1>
        {mySongs.map((song) => (
          <div>
            <img src={song.coverImageUrl} />
            <h2>{song.title}</h2>
          </div>
        ))}
      </div>
    </>
  );
};

export default Profile;
