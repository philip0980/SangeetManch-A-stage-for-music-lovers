import express from "express";
import { songSearch, playlistSearch } from "../controller/search.js";

const router = express.Router();

router.get("/song/search", songSearch);
router.get("/playlist/search", playlistSearch);

export default router;
