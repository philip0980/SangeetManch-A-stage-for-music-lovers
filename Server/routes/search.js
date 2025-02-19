import express from "express";
import {
  songSearch,
  playlistSearch,
  myPlaylist,
} from "../controller/search.js";
import { isAuthenticated } from "../middleware/auth.js";
import { mySongs } from "../controller/search.js";

const router = express.Router();

router.get("/song/search", songSearch);
router.get("/song/my-song", isAuthenticated, mySongs);
router.get("/playlist/my-playlist", isAuthenticated, myPlaylist);
router.get("/playlist/search", playlistSearch);

export default router;
