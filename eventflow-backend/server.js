const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Import Routes
const authRoutes = require("./routes/auth");     // handles /api/login and /api/signup
const eventRoutes = require("./routes/events");  // handles /api/events
const rsvpRoutes = require("./routes/rsvps");    // handles /api/rsvps
const chatRoutes = require("./routes/chat");     // handles /api/chat

// ✅ Mount Routes
app.use("/api", authRoutes);         // handles /api/login, /api/signup
app.use("/api/events", eventRoutes);
app.use("/api/rsvps", rsvpRoutes);
app.use("/api/chat", chatRoutes);

// ✅ Optional test route for health check
app.get("/api/test", (req, res) => {
  res.json({ message: "✅ Backend is working!" });
});

// ✅ MongoDB + WebSocket Setup
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB connected");

  const server = http.createServer(app);

  // Start WebSocket server
  const initWebSocket = require("./websocket");
  initWebSocket(server);

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
})
.catch(err => {
  console.error("❌ MongoDB connection error:", err);
});
