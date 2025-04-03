const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  userType: { type: String, enum: ["student", "faculty"], required: true }
});

// Check if the model is already defined to prevent overwriting
const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);

module.exports = Student;
