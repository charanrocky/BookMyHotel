import Room from "../models/Room.js";
import { SegmentTree } from "../utils/SegmentTree.js";

let demandData = [];

const loadDemandData = async () => {
  const rooms = await Room.find();
  demandData = rooms.map((room) => room.demand || 0);
};

const segmentTree = new SegmentTree(demandData);
const updateRoomPrice = async (req, res) => {
  try {
    const { roomId, demandChange } = req.body;

    if (!roomId || demandChange === undefined) {
      console.error("Invalid request data:", req.body);
      return res.status(400).json({ error: "Invalid request data" });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      console.error("Room not found:", roomId);
      return res.status(404).json({ error: "Room not found" });
    }

    // ✅ Example: Adjust price based on demand
    const priceChange = demandChange * 10;
    room.price += priceChange;

    await room.save();

    console.log(`Updated price for room ${roomId}: ${room.price}`);
    return res.status(200).json({
      message: "Price updated successfully",
      updatedPrice: room.price,
    });
  } catch (error) {
    console.error("Failed to update price:", error);
    return res.status(500).json({ error: "Failed to update price" });
  }
};

const getRoomPrice = async (req, res) => {
  const { roomId } = req.params;

  try {
    const roomIndex = demandData.findIndex(
      (_, index) => Room[index]._id.toString() === roomId
    );
    if (roomIndex === -1)
      return res.status(404).json({ message: "Room not found" });

    const price =
      100 +
      segmentTree.queryRange(0, 0, demandData.length - 1, roomIndex, roomIndex);

    res.status(200).json({ price });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

loadDemandData(); // Initialize data
const createRoom = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  const { roomNumber, type, price, available } = req.body;

  try {
    const newRoom = await Room.create({ roomNumber, type, price, available });
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Rooms
const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Room
const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Room (Admin Only)
const updateRoom = async (req, res) => {
  // ✅ Ensure user is admin
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  try {
    // ✅ Destructure to avoid updating unintended fields
    const { name, price, capacity, available } = req.body;

    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { name, price, capacity, available },
      { new: true, runValidators: true }
    );

    if (!room) return res.status(404).json({ message: "Room not found" });

    res.status(200).json(room);
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete Room (Admin Only)
const deleteRoom = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.status(200).json({ message: "Room deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getRoomPrice,
  getAllRooms,
  createRoom,
  getRoomById,
  updateRoom,
  deleteRoom,
  updateRoomPrice,
};
