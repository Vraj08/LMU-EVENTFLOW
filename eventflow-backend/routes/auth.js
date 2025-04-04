const express = require("express");
const router = express.Router();
const Student = require("../models/Student.js");

// POST /api/login
router.post("/login", async (req, res) => {
  router.post("/login", async (req, res) => {
    console.log("🔥 /api/login HIT"); // <-- add this line
    const { email, firstName, lastName } = req.body;
    ...
  });
  
  const { email, firstName, lastName } = req.body;

  try {
    let user = await Student.findOne({ email });

    if (user) {
      // Existing user: send saved data
      return res.status(200).json({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType: user.userType
      });
    }

    // New user: require name
    if (!firstName || !lastName) {
      return res.status(404).json({ message: "New user - name required" });
    }

    // Infer role from email domain
    const userType = email.endsWith("@lion.lmu.edu") ? "student"
                     : email.endsWith("@lmu.edu") ? "faculty"
                     : null;

    if (!userType) {
      return res.status(400).json({ message: "Invalid email domain" });
    }

    const newUser = await Student.create({ email, firstName, lastName, userType });

    return res.status(201).json({
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      userType: newUser.userType
    });

  } catch (err) {
    console.error("❌ /api/login error:", err);
    return res.status(500).json({ message: "Server error" });
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
