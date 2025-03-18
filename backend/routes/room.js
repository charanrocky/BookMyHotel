import express from "express";
import Room from "../models/Room.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";
import { updateRoomPrice } from "../controllers/roomController.js";

const router = express.Router();

// ✅ Update Room Price (Admin Only)
router.post("/update-price", verifyAdmin, updateRoomPrice);

// ✅ Create Room (Admin Only)
router.post("/", verifyAdmin, async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();
    res.status(201).json(room);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Get All Rooms
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Update Room (Admin Only)
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(room);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Delete Room (Admin Only)
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
