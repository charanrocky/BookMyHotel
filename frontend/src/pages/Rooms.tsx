import { useEffect, useState } from "react";
import API from "../services/api";

interface Room {
  _id: string;
  roomNumber: string;
  type: string;
  price: number;
  status: string;
}

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const res = await API.get("/rooms");
      setRooms(res.data);
    };
    fetchRooms();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Available Rooms</h2>
      <div className="grid grid-cols-3 gap-4">
        {rooms.map((room) => (
          <div key={room._id} className="border p-4 rounded">
            <p>Room Number: {room.roomNumber}</p>
            <p>Type: {room.type}</p>
            <p>Price: ${room.price}</p>
            <p>Status: {room.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rooms;
