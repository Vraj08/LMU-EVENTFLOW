const express = require("express");
const router = express.Router();
const Student = require("../models/Student.js");
router.get("/debug", (req, res) => {
  console.log("🔥 /api/debug hit");
  res.json({ status: "✅ auth.js is mounted" });
});
router.use((req, res, next) => {
  console.log(`📦 Incoming ${req.method} → ${req.originalUrl}`);
  next();
});

const nodemailer = require("nodemailer");

router.post("/send-otp", async (req, res) => {
  const { email, otp, time } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "lmueventflow@gmail.com",
      pass: "uaxm rmxi dayt ugml", // app password
    },
  });

  const mailOptions = {
    from: `"LMU EVENTFLOW" <lmueventflow@gmail.com>`,
    to: email,
    subject: "Your LMU EVENTFLOW OTP",
    html: `
      <p>To authenticate, please use the following One Time Password (OTP):</p>
      <h2 style="color:#1e90ff;">${otp}</h2>
      <p>This OTP will be valid for 15 minutes till <strong>${time}</strong>.</p>
      <br />
      <p><i>Do not share this OTP with anyone. If you didn't make this request, you can safely ignore this email.</i></p>
      <p style="font-size:0.9em;color:#555;">LMU EVENTFLOW will never contact you about this email or ask for any login codes or links.</p>
      <br />
      <p>Thanks for visiting LMU EVENTFLOW!</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("❌ Failed to send OTP:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
});


// POST /api/login
router.post("/login", async (req, res) => {
  console.log("🔥 /api/login HIT");
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
    const userType = email.endsWith("@lion.lmu.edu")
  ? "Student"
  : email.endsWith("@lmu.edu")
  ? "Faculty"
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
