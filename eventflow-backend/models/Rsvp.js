const mongoose = require("mongoose");

const rsvpSchema = new mongoose.Schema({
  eventId: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
});

// Prevent duplicate RSVPs for the same event & email
rsvpSchema.index({ eventId: 1, email: 1 }, { unique: true });

module.exports = mongoose.model("Rsvp", rsvpSchema);
