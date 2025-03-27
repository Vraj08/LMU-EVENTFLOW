const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // to use .env variables

const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");
const rsvpRoutes = require("./routes/rsvps");

const app = express(); // ✅ Declare app FIRST

app.use(cors());
app.use(express.json());

// Routes (✅ move this after app is declared)
app.use("/api", authRoutes);          // handles /api/login, etc.
app.use("/api/events", eventRoutes);  // handles /api/events/all, etc.
app.use("/api/rsvps", rsvpRoutes);    // ✅ this line moved here

// Connect to MongoDB using .env or fallback
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/eventflow", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("✅ MongoDB connected");

    // Start server only after DB connects
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
