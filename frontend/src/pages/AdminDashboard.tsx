import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getRooms,
  updateRoomPrice,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../services/roomService";
import {
  getAllBookings,
  deleteBooking,
  updateBooking,
} from "../services/bookingService";
import { useAuth } from "../context/AuthContext";

interface Booking {
  _id: string;
  user: {
    email: string;
  };
  room: {
    name: string;
  };
  checkInDate: string;
  checkOutDate: string;
}

interface Room {
  _id: string;
  name: string;
  price: number;
  capacity: number;
  available: boolean;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout, token } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
  const [editedBooking, setEditedBooking] = useState<Partial<Booking> | null>(
    null
  );

  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [newRoom, setNewRoom] = useState<Partial<Room>>({
    name: "",
    price: 0,
    capacity: 0,
    available: true,
  });

  // ✅ Fetch Data
  const fetchData = async () => {
    try {
      const roomsData = await getRooms();
      const bookingsData = await getAllBookings();

      setRooms(roomsData);
      setBookings(bookingsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Handle Login Redirect
  const login = () => navigate("/login");
  const home = () => navigate("/");

  const handleEditBooking = (booking: Booking) => {
    setEditingBookingId(booking._id);
    setEditedBooking({
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
    });
  };

  // ✅ Handle Price Update
  const handleDemandChange = async (roomId: string, demandChange: number) => {
    try {
      const data = await updateRoomPrice(roomId, demandChange);
      alert(`Price updated to ${data.updatedPrice}`);
      fetchData();
    } catch (error: any) {
      console.error("Failed to update price:", error.message);
    }
  };

  // ✅ Delete Booking
  const handleDeleteBooking = async (id: string) => {
    if (confirm("Are you sure you want to delete this booking?")) {
      await deleteBooking(id);
      fetchData();
    }
  };

  const handleSaveBooking = async (id: string) => {
    if (editedBooking) {
      await updateBooking(id, {
        checkInDate: editedBooking.checkInDate || "",
        checkOutDate: editedBooking.checkOutDate || "",
      });
      setEditingBookingId(null);
      setEditedBooking(null);
      fetchData(); // Refresh bookings
    }
  };

  // ✅ Cancel Editing
  const handleCancelEdit = () => {
    setEditingBookingId(null);
    setEditedBooking(null);
  };

  const handleCreateRoom = async () => {
    if (!newRoom.name || !newRoom.price || !newRoom.capacity) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (editingRoomId) {
        await updateRoom(editingRoomId, newRoom);
        setEditingRoomId(null);
      } else {
        await createRoom(newRoom);
      }
      setNewRoom({
        name: "",
        price: 0,
        capacity: 0,
        available: true,
      });
      fetchData(); // Refresh rooms after create/update
    } catch (error) {
      console.error("Failed to create/update room:", error);
    }
  };

  // ✅ Edit Room
  const handleEditRoom = (room: Room) => {
    setNewRoom({
      name: room.name,
      price: room.price,
      capacity: room.capacity,
      available: room.available,
    });
    setEditingRoomId(room._id);
  };

  // ✅ Cancel Edit
  const handleCancelEditRoom = () => {
    setEditingRoomId(null);
    setNewRoom({
      name: "",
      price: 0,
      capacity: 0,
      available: true,
    });
  };

  // ✅ Delete Room
  const handleDeleteRoom = async (id: string) => {
    if (confirm("Are you sure you want to delete this room?")) {
      await deleteRoom(id);
      fetchData(); // Refresh rooms after delete
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      {/* ✅ Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={home}
          className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-red-600 transition shadow-md"
        >
          Home
        </button>
        <h2 className="text-3xl font-bold text-gray-900">🏨 Admin Dashboard</h2>
        <div>
          {token ? (
            <button
              onClick={logout}
              className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-md"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={login}
              className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition shadow-md"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* ✅ Booking Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4 mb-8">
        <h3 className="text-lg font-semibold mb-4">Bookings</h3>
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 border-b">
              <th className="p-3 text-left">User Email</th>
              <th className="p-3 text-left">Room</th>
              <th className="p-3 text-left">Check-In</th>
              <th className="p-3 text-left">Check-Out</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr
                key={booking._id}
                className="hover:bg-gray-50 transition border-b"
              >
                <td className="p-3">{booking.user.email}</td>
                <td className="p-3">{booking.room.name}</td>

                {/* ✅ Editable Fields */}
                {editingBookingId === booking._id ? (
                  <>
                    <td className="p-3">
                      <input
                        type="date"
                        value={editedBooking?.checkInDate?.slice(0, 10) || ""}
                        onChange={(e) =>
                          setEditedBooking((prev) => ({
                            ...prev,
                            checkInDate: e.target.value,
                          }))
                        }
                        className="border rounded px-2 py-1 w-full"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="date"
                        value={editedBooking?.checkOutDate?.slice(0, 10) || ""}
                        onChange={(e) =>
                          setEditedBooking((prev) => ({
                            ...prev,
                            checkOutDate: e.target.value,
                          }))
                        }
                        className="border rounded px-2 py-1 w-full"
                      />
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-3">
                      {new Date(booking.checkInDate).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      {new Date(booking.checkOutDate).toLocaleDateString()}
                    </td>
                  </>
                )}

                {/* ✅ Actions */}
                <td className="p-3 flex gap-2">
                  {editingBookingId === booking._id ? (
                    <>
                      <button
                        onClick={() => handleSaveBooking(booking._id)}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditBooking(booking)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBooking(booking._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Create/Update Room Form */}
      <div className="bg-white p-6 shadow-md rounded-md mb-6">
        <h3 className="text-xl font-semibold mb-4">
          {editingRoomId ? "Edit Room" : "Create New Room"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Room Name"
            value={newRoom.name || ""}
            onChange={(e) =>
              setNewRoom((prev) => ({ ...prev, name: e.target.value }))
            }
            className="border px-4 py-2 rounded w-full"
          />
          <input
            type="number"
            placeholder="Price"
            value={newRoom.price || ""}
            onChange={(e) =>
              setNewRoom((prev) => ({
                ...prev,
                price: Number(e.target.value),
              }))
            }
            className="border px-4 py-2 rounded w-full"
          />
          <input
            type="number"
            placeholder="Capacity"
            value={newRoom.capacity || ""}
            onChange={(e) =>
              setNewRoom((prev) => ({
                ...prev,
                capacity: Number(e.target.value),
              }))
            }
            className="border px-4 py-2 rounded w-full"
          />
          <select
            value={newRoom.available ? "true" : "false"}
            onChange={(e) =>
              setNewRoom((prev) => ({
                ...prev,
                available: e.target.value === "true",
              }))
            }
            className="border px-4 py-2 rounded w-full"
          >
            <option value="true">Available</option>
            <option value="false">Booked</option>
          </select>
          <div className="flex gap-4 mt-2">
            <button
              onClick={handleCreateRoom}
              className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              {editingRoomId ? "Update Room" : "Create Room"}
            </button>
            {editingRoomId && (
              <button
                onClick={handleCancelEditRoom}
                className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Room List */}
      <h3 className="text-lg font-semibold mb-4">Rooms</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div
            key={room._id}
            className="bg-white shadow-lg rounded-lg p-6 transition hover:shadow-xl"
          >
            <h4 className="text-xl font-semibold mb-2">{room.name}</h4>
            <p className="text-gray-600">
              💰 <span className="font-medium">${room.price}</span>
            </p>
            <p className="text-gray-600">
              👥 <span className="font-medium">{room.capacity} people</span>
            </p>
            <p className="mt-2">
              {room.available ? (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                  Available
                </span>
              ) : (
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full">
                  Booked
                </span>
              )}
            </p>

            {/* ✅ Button Group */}
            <div className="flex flex-wrap gap-3 mt-4">
              <button
                onClick={() => handleDemandChange(room._id, 1)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition"
              >
                Increase Demand
              </button>
              <button
                onClick={() => handleDemandChange(room._id, -1)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition"
              >
                Decrease Demand
              </button>
              <button
                onClick={() => handleEditRoom(room)}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteRoom(room._id)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
