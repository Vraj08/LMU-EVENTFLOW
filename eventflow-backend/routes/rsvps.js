const express = require("express");
const router = express.Router();
const Rsvp = require("../models/Rsvp");

router.post("/", async (req, res) => {
  const { eventId, email } = req.body;

  if (!eventId || !email) {
    return res.status(400).json({ message: "Event ID and email are required." });
  }

  try {
    const newRsvp = new Rsvp({ eventId, email });
    await newRsvp.save();
    res.status(201).json({ message: "RSVP saved successfully!" });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "You’ve already RSVPed to this event." });
    }
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

module.exports = router;
