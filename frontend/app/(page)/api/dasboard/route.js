import { getAccessUser } from "../../../utils/apiClient";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Fetch allocated rooms
export const fetchAllocatedRooms = async () => {
  try {
    const userData = getAccessUser();  
    if (!userData) {
      throw new Error("User data is missing or invalid");
    }

    const token = userData.accessToken;  
    if (!token) {
      throw new Error("Access token is missing");
    }

    const response = await fetch(`${API_BASE_URL}/api/rooms/allocated_rooms`, {
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
    const userData = getAccessUser();  
    if (!userData) {
      throw new Error("User data is missing or invalid");
    }

    const token = userData.accessToken;  
    if (!token) {
      throw new Error("Access token is missing");
    }


    const response = await fetch(`${API_BASE_URL}/api/rooms/create_room`, {
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

    return await response.json(); 
  } catch (error) {
    console.error("Error creating room:", error);
    throw error;
  }
};
// add user to room with role
export const allocateToRoom = async (selectedRoomId, selectedUserId, selectedUserRole) => {
  try {
    const userData = getAccessUser();  
    if (!userData) {
      throw new Error("User data is missing or invalid");
    }

    const token = userData.accessToken;  
    if (!token) {
      throw new Error("Access token is missing");
    }

    const response = await fetch(`${API_BASE_URL}/api/rooms/allocate_room`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      body: JSON.stringify({ selectedRoomId, selectedUserId, selectedUserRole }),
    });

    if (!response.ok) {
      throw new Error(`Error Allocating room: ${response.statusText}`);
    }

    return await response.json(); 
  } catch (error) {
    console.error("Error Allocating room:", error);
    throw error;
  }
};

export const deleteRoomwithUsers = async (roomId, roomName) => {
  try {
    const userData = getAccessUser();  
    if (!userData) {
      throw new Error("User data is missing or invalid");
    }

    const token = userData.accessToken;  
    if (!token) {
      throw new Error("Access token is missing");
    }


    const response = await fetch(`${API_BASE_URL}/api/rooms/delete_room`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      body: JSON.stringify({ roomId }),
    });

    if (!response.ok) {
      throw new Error(`Error deleting room: ${response.statusText}`);
    }

    return await response.json(); 
  } catch (error) {
    console.error("Error deleting room:", error);
    throw error;
  }
};

