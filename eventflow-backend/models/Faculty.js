const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  userType: { type: String, enum: ["Student", "Faculty"], required: true }
});

// Check if the model is already defined to prevent overwriting
const Faculty = mongoose.models.Faculty || mongoose.model("Faculty", facultySchema);

module.exports = Faculty;
