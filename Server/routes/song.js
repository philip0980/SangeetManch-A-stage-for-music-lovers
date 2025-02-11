import express from "express";
import multer from "multer";
import path from "path";
import {
  UploadSong,
  DeleteSong,
  UpdateSong,
  FetchSong,
  FetchAllSongs,
} from "../controller/song.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

// Route for music upload
router.post(
  "/upload",
  isAuthenticated,
  upload.fields([
    { name: "fileUrl", maxCount: 1 },
    { name: "coverImageUrl", maxCount: 1 },
  ]),
  UploadSong
);

router.delete("/delete/:id", isAuthenticated, DeleteSong);
router.patch("/patch/:id", isAuthenticated, UpdateSong);

// Apis for streaming
router.get("/stream/:id", FetchSong);
router.get("/all-songs", FetchAllSongs);

export default router;
