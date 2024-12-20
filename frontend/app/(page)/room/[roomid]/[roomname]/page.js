"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/app/components/navbar/Navbar';
import ParticipantRoom from '@/app/components/rooms/ParticipantRoom';
import { fetchAllocatedRole } from '@/app/(page)/api/room/get-room-role/route';

const RoomPage = () => {
  const params = useParams();  
  const roomId = params.roomid;
  const roomName = params.roomname;

  const [userRole, setUserRole] = useState(null);

  console.log(params);  

  useEffect(() => {
    const getUserRole = async () => {
      try {
        const response = await fetchAllocatedRole(roomId);

        setUserRole(response.data.userRole);  
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUserRole('');  
      }
    };

    getUserRole();
  }, []);  

  if (!roomId || !userRole) {
    return <div className="min-h-screen flex justify-center items-center text-xl text-gray-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar />
      <div className="w-full max-w-full px-4 py-8">
        <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-blue-600 text-white p-6">
            <h3 className="text-2xl font-semibold">{`Room: ${decodeURIComponent(roomName)}`}</h3>
          </div>
          <div className="p-6">
            <ParticipantRoom roomId={roomId} roomName={roomName} uRole={userRole} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
