import API from "./api";

// ✅ Book a room
export const bookRoom = async (
  roomId: string,
  checkInDate: string,
  checkOutDate: string
) => {
  const res = await API.post(`/bookings`, {
    roomId,
    checkInDate,
    checkOutDate,
  });
  return res.data;
};

export const getAllBookings = async () => {
  const res = await API.get("/bookings/all", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.data;
};
export const deleteBooking = async (id: string) => {
  await API.delete(`/bookings/${id}`);
};

export const updateBooking = async (id: string, updatedData: any) => {
  const res = await API.put(`/bookings/${id}`, updatedData);
  return res.data;
};
