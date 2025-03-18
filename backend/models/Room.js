import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    capacity: Number,
    available: Boolean,
    demandScore: {
      type: Number,
      default: 0, // Demand score starts at 0
    },
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);
export default Room;
