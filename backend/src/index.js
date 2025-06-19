import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import session from "express-session";
import passport from "passport";
import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// -------------------------
// 🧠 Connect MongoDB
// -------------------------
connectDB();

// -------------------------
// 🔐 Middleware Setup
// -------------------------
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", // ✅ Frontend origin
    credentials: true,               // ✅ Allow cookies
  })
);

// -------------------------
// 🛡️ Session + Passport Setup
// -------------------------
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // true if using HTTPS in production
      httpOnly: true,
      sameSite: "Lax", // or "None" if using HTTPS and cross-site
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// -------------------------
// 📦 Routes
// -------------------------
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// -------------------------
// 🌐 Serve frontend in production
// -------------------------
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// -------------------------
// 🚀 Start server
// -------------------------
server.listen(PORT, () => {
  console.log("✅ Server is running on PORT:", PORT);
});
