const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  building: String,
  room: String,
});

module.exports = mongoose.model("Room", RoomSchema);
