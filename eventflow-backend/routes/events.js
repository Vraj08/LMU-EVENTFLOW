const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

// ✅ GET all approved & active events
router.get("/all", async (req, res) => {
  try {
    const events = await Event.find({ isActive: true, isApproved: true });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch events." });
  }
});

// ✅ GET all events created by a specific user
router.get("/user/:email", async (req, res) => {
  try {
    const userEmail = decodeURIComponent(req.params.email);
    const events = await Event.find({ createdBy: userEmail });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// ✅ SOFT DELETE an event (PUT method)
router.put("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { isActive: false, isApproved: false },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ CREATE event with auto-incremented eventId
router.post("/", async (req, res) => {
  try {
    const { title, description, date, time, createdBy } = req.body;

    if (!createdBy) {
      return res.status(400).json({ message: "createdBy is required" });
    }

    // Fetch only eventIds to reduce data transfer
    const allIds = await Event.find({}, { eventId: 1 });

    let maxNum = 0;

    allIds.forEach(ev => {
      const num = parseInt(ev.eventId?.replace("EVT", ""));
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    });

    const newId = `EVT${(maxNum + 1).toString().padStart(3, "0")}`;

    const newEvent = new Event({
      title,
      description,
      date,
      time,
      isActive: true,
      isApproved: false,
      createdBy,
      eventId: newId,
    });

    await newEvent.save();
    res.status(201).json({ message: "Event created", event: newEvent });
  } catch (error) {
    console.error("❌ Error creating event:", error);
    res.status(500).json({ message: "Failed to create event" });
  }
});

// ✅ UPDATE an event by its MongoDB _id (preserve eventId + check for no changes)
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, date, time } = req.body;

  try {
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if any changes were made
    if (
      event.title === title &&
      event.description === description &&
      event.date === date &&
      event.time === time
    ) {
      return res.status(200).json({ message: "No changes made" });
    }

    // Update only the fields that are allowed (preserve eventId)
    event.title = title;
    event.description = description;
    event.date = date;
    event.time = time;

    await event.save();

    res.status(200).json({ message: "Event updated", event });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Failed to update event", error: err });
  }
});


// ✅ GET a single event by its MongoDB ID
router.get("/:eventId", async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: "Error fetching event" });
  }
});

module.exports = router;
