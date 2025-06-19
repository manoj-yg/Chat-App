import express from "express";
import passport from "passport";

import {
  signup,
  login,
  logout,
  updateProfile,
  deleteAccount,
  checkAuth,
} from "../controllers/auth.controller.js";

import { protectRoute } from "../middleware/auth.middleware.js";
import { searchUsers } from "../controllers/auth.controller.js";
import { markMessagesAsRead } from "../controllers/message.controller.js"; // ✅ Import this



const router = express.Router();

// 🌐 Public Auth Routes
router.post("/signup", signup);
router.post("/login", login);

// 🌐 Protected Auth Routes
router.post("/logout", protectRoute, logout);
router.get("/check", protectRoute, checkAuth);
router.put("/update-profile", protectRoute, updateProfile);
router.delete("/delete-account", protectRoute, deleteAccount);
router.delete("/delete-account", protectRoute, deleteAccount);
router.put("/read/:senderId", protectRoute, markMessagesAsRead);

router.get("/search", protectRoute, searchUsers);
// 👇 (Optional) Google / GitHub OAuth can be added here using passport

export default router;
