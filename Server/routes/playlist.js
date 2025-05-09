import express from "express";
import {
  CreatePlaylist,
  DeletePlaylist,
  EditPlaylist,
  AddSong,
  removeSongFromPlaylist,
  reorderSongsInPlaylist,
  searchSinglePlaylist,
  findPlaylist,
} from "../controller/playlist.js";
import { isAuthenticated } from "../middleware/auth.js";
import { authenticateAdmin } from "../middleware/authAdmin.js";

const router = express.Router();

// Playlist Creation & Modification
router.post("/create", isAuthenticated, CreatePlaylist);
router.patch("/edit/:id", isAuthenticated, EditPlaylist);
router.delete("/delete/:id", isAuthenticated, DeletePlaylist);

// Adding & Removing Songs
router.post("/add-song/:id", isAuthenticated, AddSong);
router.post("/remove-song/:id", isAuthenticated, removeSongFromPlaylist);
router.post("/reorder-song/:id", isAuthenticated, reorderSongsInPlaylist);

router.get(
  "/search-single-playlist/:id",
  isAuthenticated,
  searchSinglePlaylist
);

router.get("/find-playlist", authenticateAdmin, findPlaylist);

export default router;
