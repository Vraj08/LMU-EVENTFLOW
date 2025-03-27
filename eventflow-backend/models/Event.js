// models/Event.js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  time: String
});

module.exports = mongoose.model("Event", eventSchema);
