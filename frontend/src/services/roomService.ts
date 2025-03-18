import API from "./api";

// ✅ Get all rooms
export const getRooms = async () => {
  const res = await API.get("/rooms");
  return res.data;
};

// ✅ Update Room Price
export const updateRoomPrice = async (roomId: string, demandChange: number) => {
  const res = await API.post(`/rooms/update-price`, {
    roomId,
    demandChange,
  });
  return res.data;
};
// ✅ Create room
export const createRoom = async (data: any) => {
  const res = await API.post("/rooms", data);
  return res.data;
};

// ✅ Update room
export const updateRoom = async (id: string, data: any) => {
  const res = await API.put(`/rooms/${id}`, data);
  return res.data;
};

// ✅ Delete room
export const deleteRoom = async (id: string) => {
  await API.delete(`/rooms/${id}`);
};
