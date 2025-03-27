const express = require("express");
const router = express.Router();
const Student = require("../models/student.js");

// POST /api/login
router.post("/login", async (req, res) => {
  const { email, firstName, lastName, userType } = req.body;

  try {
    let user = await Student.findOne({ email });

    if (user) {
      return res.status(200).json({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType: user.userType,
        newUser: false,
      });
    }

    if (!firstName || !lastName || !userType) {
      return res.status(404).json({ message: "Student not found" });
    }

    user = await Student.create({ email, firstName, lastName, userType });

    return res.status(201).json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userType: user.userType,
      newUser: true,
    });

  } catch (err) {
    console.error("❌ Error in /api/login:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/update-profile
router.put("/update-profile", async (req, res) => {
  const { email, firstName, lastName } = req.body;

  console.log("🔧 Updating profile for:", email, firstName, lastName);  // debug log

  try {
    const updated = await Student.findOneAndUpdate(
      { email },
      { firstName, lastName },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      firstName: updated.firstName,
      lastName: updated.lastName,
      email: updated.email,
      userType: updated.userType,
    });

  } catch (err) {
    console.error("❌ Error in /api/update-profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
