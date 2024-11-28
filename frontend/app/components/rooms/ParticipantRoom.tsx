import "@livekit/components-styles";
import {
  LiveKitRoom,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  ControlBar,
  useTracks
} from "@livekit/components-react";
import { useEffect, useState } from "react";
import { Track, Room, Participant, RoomConnectOptions } from "livekit-client";
import { getAccessUser } from "@/app/utils/apiClient";

interface GenRoomProps {
  roomId: string;
  roomName: string;
  uRole: string;
}

const ParticipantRoom: React.FC<GenRoomProps> = ({ roomId, roomName, uRole }) => {
  const [token, setToken] = useState<string>("");
  const [room, setRoom] = useState<Room | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const userData = getAccessUser();

  if (!userData) {
    throw new Error("User data is missing or invalid");
  }

  const username = userData.name;

  useEffect(() => {
    getToken();
  }, [roomId, roomName, uRole]);

  const getToken = async () => {
    if (!roomId || !roomName) return;
    try {
      const resp = await fetch(
        `/api/livekit-token?room=${roomId}&username=${username} (${uRole})&role=${uRole}`
      );
      const data = await resp.json();
      setToken(data.token);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleMuteAll = () => {
    if (!room) return;
  
    room.participants.forEach((participant: Participant) => {
      participant.audioTracks.forEach((trackPub) => {
        if (trackPub.track) {
          isMuted ? trackPub.track.unmute() : trackPub.track.mute();
        }
      });
    });
  
    setIsMuted(!isMuted);
  };

  if (token === "") {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          getToken();
        }}
        className="flex flex-col justify-center items-center min-h-screen"
      >
        <div className="mb-4 w-full max-w-sm">
          <label htmlFor="roomId" className="block text-gray-700">
            Room:
          </label>
          <input
            id="roomId"
            type="text"
            placeholder="Room"
            value={roomId}
            className="ring-1 ring-gray-300 p-2 mt-1 w-full"
            readOnly
          />
        </div>
        <div className="mb-4 w-full max-w-sm">
          <label htmlFor="username" className="block text-gray-700">
            Name:
          </label>
          <input
            id="username"
            type="text"
            placeholder="Name"
            value={username}
            className="ring-1 ring-gray-300 p-2 mt-1 w-full"
            readOnly
          />
        </div>
        <button
          type="submit"
          className="p-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors w-full max-w-sm"
        >
          Join
        </button>
      </form>
    );
  }

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      onConnected={(roomInstance) => {
        setRoom(roomInstance);
        console.log("Room connected:", roomInstance);
      }}
      onDisconnected={() => setToken("")}
      data-lk-theme="default"
      style={{
        height: "100vh", // Full screen height
        position: "relative",
        overflow: "hidden", // Prevent overflow
      }}
    >
      {uRole === "admin" && <AdminControls room={room} />}
      <MyVideoConference />
      <RoomAudioRenderer />
      <ControlBar />

      <div className="absolute top-4 right-4 z-10">
        {(uRole === 'admin' || uRole === 'moderator') && (
          <button
            onClick={toggleMuteAll}
            className={`p-2 ${isMuted ? "bg-red-500" : "bg-green-500"} text-white rounded-md`}
          >
            {isMuted ? "Unmute All" : "Mute All"}
          </button>
        )}
      </div>
    </LiveKitRoom>
  );
};

const AdminControls: React.FC<{ room: Room | null }> = ({ room }) => {
  // if (!room) return null;

  const endRoom = () => {
    if (room) {
      room.disconnect();
      console.log('Room ended by admin');
    }
  };

  return (
    <div className="admin-controls absolute  bottom-3 right-4 z-10">
      <button
        disabled={!room}
        onClick={endRoom}
        className="bg-red-500 p-2 text-white rounded-md"
      >
        End Room
      </button>
    </div>
  );
};

const MyVideoConference: React.FC = () => {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    // { onlySubscribed: false }
  );

  return (
    <GridLayout
      tracks={tracks}
      style={{
        height: 'calc(100vh - var(--lk-control-bar-height))', // Adjust height to fit screen
        overflow: 'hidden', // Ensure no overflow
      }}
    >
      <ParticipantTile />
    </GridLayout>
  );
};

export default ParticipantRoom;
