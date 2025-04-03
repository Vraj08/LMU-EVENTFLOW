const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", require("./routes/auth"));
app.use("/api/events", require("./routes/events"));
app.use("/api/rsvps", require("./routes/rsvps"));
app.use("/api/chat", require("./routes/chat")); // ✅ your /chat API
app.use("/api/login", loginRoutes);
app.use("/api/signup", signupRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/events", eventRoutes);

// MongoDB connect
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB connected");

  const server = http.createServer(app);

  // ✅ Start WebSocket server on same HTTP server
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
