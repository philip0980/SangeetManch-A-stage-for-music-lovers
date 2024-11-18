import express from "express";
import dotenv from "dotenv";
import DatabaseConnect from "./config/db.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
dotenv.config();
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.get("/", (req, res) => {
  res.send("Hello world");
});

DatabaseConnect();

// Audio Schema

const audioSchema = new mongoose.Schema({
  filename: String,
  data: Buffer,
  contentType: String,
});

const Audio = mongoose.model("Audio", audioSchema);

// multer to handle file uploads

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 16 * 1024 * 1024 } });

// upload file to database

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const newAudio = new Audio({
      filename: req.file.originalname,
      data: req.file.buffer,
      contentType: req.file.mimetype,
    });

    const savedAudio = await newAudio.save();
    res.send({ message: "File uploaded successfully", _id: savedAudio._id });
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to upload the file");
  }
});

app.get("/audio/:id", async (req, res) => {
  try {
    const audio = await Audio.findById(req.params.id);

    if (!audio) {
      return res.status(404).send("Audio not found");
    }

    res.set("Content-Type", audio.contentType);
    res.send(audio.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to retrieve the audio");
  }
});

const port = 8000;
app.listen(port, () => {
  console.log(`App listening at port ${port}`);
});
