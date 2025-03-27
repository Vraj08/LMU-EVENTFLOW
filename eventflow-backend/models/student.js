const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  userType: { type: String, enum: ["student", "faculty"], required: true }
});

module.exports = mongoose.model("Student", studentSchema);  // ✅ Add this
