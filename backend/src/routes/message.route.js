import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
  deleteMessage, // ✅ added
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);       // get sidebar users
router.get("/:id", protectRoute, getMessages);                // get messages
router.post("/send/:id", protectRoute, sendMessage);          // send message
router.delete("/:messageId", protectRoute, deleteMessage);    // ✅ delete message

export default router;
