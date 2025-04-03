const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  chatId: String,
  sender: String,
  receiver: String,
  senderName: String,     // 👈 Add this
  receiverName: String,   // 👈 Add this
  text: String,
  timestamp: Date,
});

module.exports = mongoose.model("Message", messageSchema);
