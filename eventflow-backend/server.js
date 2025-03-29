const express = require("express");
const app = express(); // ✅ App should be declared before use()
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");
const rsvpRoutes = require("./routes/rsvps");

app.use(cors());
app.use(express.json());

// ✅ Routes after middleware
app.use("/api", authRoutes);
app.use("/api/events", eventRoutes);  // ✅ Make sure this line appears ONCE
app.use("/api/rsvps", rsvpRoutes);

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/eventflow", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
