import express, { urlencoded } from "express";
import dotenv from "dotenv";
import DatabaseConnect from "./config/db.js";
import cors from "cors";
import userRoute from "./routes/user.js";
import songRoute from "./routes/song.js";
import playlistRoute from "./routes/playlist.js";
import searchRoute from "./routes/search.js";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";

const app = express();
dotenv.config();
DatabaseConnect();

app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/user", userRoute);
app.use("/api/v1/song", songRoute);
app.use("/api/v1/playlist", playlistRoute);
app.use("/api/v1", searchRoute);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App listening at port ${port}`);
});
