// routes/events.js
const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

router.get("/all", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
