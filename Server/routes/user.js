import express from "express";
import {
  Register,
  Login,
  Logout,
  ChangePassword,
  UpdateProfile,
  DeleteAccount,
  BanAccount,
  SuspendAccount,
  CheckSuspension,
  getProfile,
  getUsers,
  singleUser,
} from "../controller/user.js";
import { isAuthenticated } from "../middleware/auth.js";
import { authenticateAdmin } from "../middleware/authAdmin.js";
import multer from "multer";

const router = express.Router();

const upload = multer({ dest: "/tmp" });

// Authentication and Authorization
router.post("/register", upload.single("avatar"), Register);
router.post("/login", Login);
router.post("/logout", Logout);

// Account recovery

// Profile management
router.get("/profile", isAuthenticated, getProfile);
router.patch("/update-profile", isAuthenticated, UpdateProfile);
router.post("/reset-password", isAuthenticated, ChangePassword);
router.delete("/delete-account", isAuthenticated, DeleteAccount);

router.get("/all-users", authenticateAdmin, getUsers);
router.get("/single-user/:id", authenticateAdmin, singleUser);

//Security and Admin Controls

router.post("/ban/:userId", authenticateAdmin, BanAccount);
router.post("/suspend/:userId", authenticateAdmin, SuspendAccount);
router.post("/check-suspension/:userId", CheckSuspension);

export default router;
