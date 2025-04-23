import express from "express";
import {
  songSearch,
  playlistSearch,
  myPlaylist,
  theirSong,
} from "../controller/search.js";
import { isAuthenticated } from "../middleware/auth.js";
import { mySongs } from "../controller/search.js";
import { authenticateAdmin } from "../middleware/authAdmin.js";

const router = express.Router();

router.get("/song/search", songSearch);
router.get("/song/my-song", isAuthenticated, mySongs);
router.get("/song/their-song/:id", authenticateAdmin, theirSong);
router.get("/playlist/my-playlist", isAuthenticated, myPlaylist);
router.get("/playlist/search", playlistSearch);

export default router;
