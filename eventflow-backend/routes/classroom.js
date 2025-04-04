const express = require("express");
const router = express.Router();
const Room = require("../models/Room");
const Booking = require("../models/Booking");

// Get all rooms
router.get("/rooms", async (req, res) => {
  const rooms = await Room.find();
  res.json(rooms);
});

// Get bookings for a specific date
router.get("/bookings", async (req, res) => {
  const { date } = req.query;
  const bookings = await Booking.find({ date });
  res.json(bookings);
});

// Book a room
router.post("/book", async (req, res) => {
  const { building, room, date, timeSlot } = req.body;

  const existing = await Booking.findOne({ building, room, date, timeSlot });
  if (existing) return res.status(409).json({ message: "Room already booked." });

  const newBooking = new Booking({ building, room, date, timeSlot });
  await newBooking.save();

  res.status(201).json({ message: "Booking successful." });
});

module.exports = router;
