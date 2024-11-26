"use client";
import { useEffect, useState } from "react";  
import { connectToRoom } from "../../utils/livekit";  
// import Admin from "./admin";
import Participant from "./Participant";
import Moderator from "./Moderator";
import Observer from "./Observer";

const GenRoom = ({ roomId, userRole }) => {
  const [isRoomConnected, setIsRoomConnected] = useState(false);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const roomConnection = await connectToRoom(roomId, userRole);
        setIsRoomConnected(true);
        return () => {
          roomConnection && roomConnection.disconnect();
        };
      } catch (error) {
        console.error("Failed to connect to the room:", error);
      }
    };

    fetchRoomData();
  }, [roomId, userRole]);

  if (!isRoomConnected) {
    return <div>Connecting to room...</div>;
  }

  return (
    <div>
      <h3>Room: {roomId}</h3>
      {/* {userRole === "admin" && <Admin roomId={roomId} />} */}
      {userRole === "participant" && <Participant />}
      {userRole === "moderator" && <Moderator />}
      {userRole === "observer" && <Observer />}
    </div>
  );
};

export default GenRoom;
