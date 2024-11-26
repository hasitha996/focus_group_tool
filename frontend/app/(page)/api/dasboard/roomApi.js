import { getAccessToken } from "../../../utils/apiClient";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Fetch allocated rooms
export const fetchAllocatedRooms = async () => {
  try {
    const token = getAccessToken();
    console.log('token');
    console.log(token);
    if (!token) {
      throw new Error("Access token is missing");
    }

    const response = await fetch(`${API_BASE_URL}/api/rooms/allocated_rooms/1`, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching rooms: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw error;
  }
};

// Create a new room
export const createNewRoom = async (name) => {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error("Access token is missing");
    }

    const response = await fetch(`${API_BASE_URL}/api/rooms/create_room/1`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error(`Error creating room: ${response.statusText}`);
    }

    return await response.json(); // Directly parse as JSON
  } catch (error) {
    console.error("Error creating room:", error);
    throw error;
  }
};
