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

const allowedOrigins = [
  "http://localhost:5173", // Your Flutter Web app's URL
  "http://127.0.0.1:39750", // In case it's running on another IP for the web
  "http://127.0.0.1:61114", // In case it's running on another IP for the web
  "http://127.0.0.1:9101", // In case it's running on another IP for the web
  "http://localhost:39750", // Flutter Web, running on localhost with port 8000
  "http://localhost:57927", // Flutter Web, running on localhost with port 8000
  "com.example.flutterapp", // For Flutter Android App (replace with your package name if needed)
  "https://flutterapp.com", // For production Flutter App on Android/iOS
  "https://nistha-music-streaming-application.onrender.com" , // React Web App 
];

// CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests from your two clients
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: "GET,POST,PUT,DELETE", // Methods allowed for the clients
    allowedHeaders: "Content-Type,Authorization", // Allowed headers
  })
);

// app.use(cors());
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
app.listen(port, "0.0.0.0", () => {
  console.log(`App listening at port ${port}`);
});
