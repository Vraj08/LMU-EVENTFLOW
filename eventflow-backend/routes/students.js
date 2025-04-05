const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

router.get("/", async (req, res) => {
  try {
    const students = await Student.find({}, "email userType");
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

// POST: Update role
router.post("/change-role", async (req, res) => {
  const { email, newRole } = req.body;

  try {
    const updated = await Student.findOneAndUpdate(
      { email },
      { userType: newRole },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error updating user role:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

module.exports = router;
