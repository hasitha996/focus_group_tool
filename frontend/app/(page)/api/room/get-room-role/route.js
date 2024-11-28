import { getAccessUser } from "../../../../utils/apiClient";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchAllocatedRole = async ( roomId) => {
  try {
    const userData = getAccessUser();  
    if (!userData) {
      throw new Error("User data is missing or invalid");
    }

    const token = userData.accessToken;  
    if (!token) {
      throw new Error("Access token is missing");
    }

    const response = await fetch(`${API_BASE_URL}/api/rooms/room_role/${roomId}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,  
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching role: ${response.statusText}`);
    }

    return await response.json(); 
  } catch (error) {
    console.error("Error fetching role:", error);
    throw error;
  }
};