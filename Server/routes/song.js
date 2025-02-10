import express from "express";

const router = express.Router();

// Apis for music upload
router.post("/upload", UploadSong);
router.delete("/delete/:id", DeleteSong);
router.patch("/patch/:id", UpdateSong);

// Apis for streaming
router.get("/stream/:id", FetchSong);

export default router;
