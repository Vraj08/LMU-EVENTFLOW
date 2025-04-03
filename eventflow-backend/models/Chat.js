const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
    unique: true
  },
  participants: {
    type: [String],
    required: true
  },
  participantNames: {
    type: [String],
    default: []
  },
  unreadCounts: {
    type: Object,
    default: {}
  },
  lastMessage: {
    type: String,
    default: ""
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // ✅ Adds createdAt and updatedAt fields
});

module.exports = mongoose.model("Chat", ChatSchema);
