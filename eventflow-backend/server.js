const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
const studentRoutes = require("./routes/students");
console.log("✅ Mounting /api/students (studentRoutes)");
app.use("/api/students", studentRoutes);

// ✅ Route Imports
const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");
const rsvpRoutes = require("./routes/rsvps");
const chatRoutes = require("./routes/chat");

// ✅ Route Mounting Logs
console.log("✅ Mounting /api (authRoutes)");
app.use("/api", authRoutes);

console.log("✅ Mounting /api/events (eventRoutes)");
app.use("/api/events", eventRoutes);
const classroomRoutes = require("./routes/classroom");
app.use("/api/classroom", classroomRoutes);

app.use("/api/rsvps", rsvpRoutes);
app.use("/api/chat", chatRoutes);

// ✅ Root Debug Route
app.get("/", (req, res) => {
  res.send("🎉 Backend is running. Root is alive.");
});

// ✅ Health Check
app.get("/api/test", (req, res) => {
  res.json({ message: "✅ Backend test route is working!" });
});

// ✅ MongoDB + WebSocket
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    const server = http.createServer(app);
    const initWebSocket = require("./websocket");
    initWebSocket(server);

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
