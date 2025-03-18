import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getRooms } from "../services/roomService";
import { bookRoom } from "../services/bookingService";
import API from "../services/api";

interface Room {
  _id: string;
  name: string;
  price: number;
  capacity: number;
  available: boolean;
}

const Home = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const { logout, token } = useAuth();
  const navigate = useNavigate();

  // ✅ Handle Login Redirect
  const login = () => {
    navigate("/login");
  };

  // ✅ Fetch Rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await API.get("/rooms");
        setRooms(data);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  // ✅ Store check-in/check-out dates
  const [dates, setDates] = useState<
    Record<string, { checkInDate: string; checkOutDate: string }>
  >({});

  // ✅ Handle Date Change
  const handleDateChange = (
    roomId: string,
    key: "checkInDate" | "checkOutDate",
    value: string
  ) => {
    setDates((prev) => ({
      ...prev,
      [roomId]: {
        ...prev[roomId],
        [key]: value,
      },
    }));
  };

  // ✅ Handle Booking
  const handleBookRoom = async (roomId: string) => {
    const { checkInDate, checkOutDate } = dates[roomId] || {};
    if (!checkInDate || !checkOutDate) {
      alert("Please select check-in and check-out dates.");
      return;
    }

    try {
      await bookRoom(roomId, checkInDate, checkOutDate);
      alert("Room booked successfully!");
      const data = await getRooms(); // Refresh after booking
      setRooms(data);
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Booking failed!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* ✅ Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🏨 Available Rooms</h2>

        <div className="flex gap-4">
          {token ? (
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={login}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* ✅ Room List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div
            key={room._id}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            {/* ✅ Room Info */}
            <div className="p-4">
              <h3 className="text-lg font-semibold">{room.name}</h3>
              <p className="text-gray-600">💰 Price: ${room.price}</p>
              <p className="text-gray-600">
                👥 Capacity: {room.capacity} people
              </p>
              <p className="text-gray-600">
                Status:{" "}
                {room.available ? (
                  <span className="text-green-500 font-medium">Available</span>
                ) : (
                  <span className="text-red-500 font-medium">Booked</span>
                )}
              </p>

              {/* ✅ Date Inputs */}
              {room.available && token && (
                <div className="flex gap-2 mt-3">
                  <input
                    type="date"
                    value={dates[room._id]?.checkInDate || ""}
                    onChange={(e) =>
                      handleDateChange(room._id, "checkInDate", e.target.value)
                    }
                    className="border p-2 w-full rounded-md focus:outline-none"
                  />
                  <input
                    type="date"
                    value={dates[room._id]?.checkOutDate || ""}
                    onChange={(e) =>
                      handleDateChange(room._id, "checkOutDate", e.target.value)
                    }
                    className="border p-2 w-full rounded-md focus:outline-none"
                  />
                </div>
              )}

              {/* ✅ Book Button */}
              {room.available && token && (
                <button
                  onClick={() => handleBookRoom(room._id)}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 w-full rounded-md transition"
                >
                  Book Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
