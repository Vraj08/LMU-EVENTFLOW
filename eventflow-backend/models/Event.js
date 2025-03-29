const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid"); // Add this line

const eventSchema = new mongoose.Schema({
  eventId: {
    type: String,
    unique: true,
    default: () => uuidv4(), // ✅ Auto-generate eventId
  },
  title: String,
  description: String,
  date: String,
  time: String,
  isActive: {
    type: Boolean,
    default: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
