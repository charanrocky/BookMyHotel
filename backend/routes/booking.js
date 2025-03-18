import express from "express";
import { verifyUser } from "../middleware/authMiddleware.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";
import Booking from "../models/Booking.js";
import Room from "../models/Room.js";

const router = express.Router();

router.post("/", verifyUser, async (req, res) => {
  const { roomId, checkInDate, checkOutDate } = req.body;

  try {
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    if (!room.available) {
      return res.status(400).json({ message: "Room is already booked" });
    }

    const booking = new Booking({
      room: roomId,
      user: req.user.id,
      checkInDate,
      checkOutDate,
    });
    await booking.save();

    room.available = false;
    await room.save();

    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});
router.get("/all", verifyUser, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const bookings = await Booking.find()
      .populate("user", "email")
      .populate("room", "name");
    res.status(200).json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete booking" });
  }
});

// ✅ Update booking (Admin only)
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: "Failed to update booking" });
  }
});

export default router;
