"use client";
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '../../../components/navbar/Navbar';  
import GenRoom from '@/app/components/room/GenRoom';


const RoomPage = () => {
  const router = useRouter();
  const params = useParams();  
  const roomId = params.roomid;
  const [userRole, setUserRole] = useState(null); 

  
  useEffect(() => {

    setUserRole('admin'); 
  }, []);

  if (!roomId || !userRole) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <Navbar />
      <div className="container mx-auto py-6">
        <GenRoom roomId={roomId} userRole={userRole} /> {/* Render the Room component */}
      </div>
    </div>
  );
};

export default RoomPage;
