const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  building: String,
  room: String,
  date: String, // e.g., '2025-04-10'
  timeSlot: String // e.g., '08:00 - 10:00'
});

module.exports = mongoose.model("Booking", BookingSchema);
