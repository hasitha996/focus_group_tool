// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Navbar from "../../components/navbar/Navbar";
// import notifications from '../../components/alarts/alerts';
// import { createNewRoom, fetchAllocatedRooms } from "../api/dasboard/roomApi";

// const Dashboard = () => {
//   const [rooms, setRooms] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [roomName, setRoomName] = useState("");
//   const router = useRouter();

//   const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

//     // Fetch rooms from the backend
//     useEffect(() => {
//       const loadRooms = async () => {
//         setLoading(true);
//         try {
//           const data = await fetchAllocatedRooms();
//           setRooms(data.rooms || []);
//         } catch (error) {
//           notifications.error("Failed to fetch rooms");
//         } finally {
//           setLoading(false);
//         }
//       };
  
//       loadRooms();
//     }, []);
  
//     // Create a new room
//     const createRoom = async (name) => {
//       setLoading(true);
//       try {
//         const data = await createNewRoom(name);
        
//         if (data.success) {
//           setShowModal(false); // Close modal on success
//           notifications.success("Room created successfully");
//           router.push(`/room/${data.roomId}`); // Redirect to the new room
//         } else {
//           console.error("Failed to create room:", data.message);
//           notifications.error("Failed to create room");
//         }
//       } catch (error) {
//         notifications.error("Error creating room");
//         console.error("Error creating room:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
  

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-blue-500 to-teal-500 text-gray-800">
//       <Navbar />
//       <div className="max-w-5xl mx-auto py-10 px-6 bg-white shadow-xl rounded-lg mt-10">
//         <h1 className="text-5xl font-semibold text-center text-gray-900 mb-8">
//           Welcome to the Admin Dashboard
//         </h1>

//         <div className="flex justify-center mb-8">
//           <button
//             onClick={() => setShowModal(true)}
//             disabled={loading}
//             className={`px-8 py-4 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition duration-300 transform ${loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
//           >
//             {loading ? "Creating Room..." : "Create New Room"}
//           </button>
//         </div>

//         {/* Modal for Room Name Input */}
//         {showModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//             <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
//               <h2 className="text-2xl font-semibold text-center text-gray-900 mb-4">Enter Room Name</h2>
//               <input
//                 type="text"
//                 value={roomName}
//                 onChange={(e) => setRoomName(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg mb-4"
//                 placeholder="Room name"
//               />
//               <div className="flex justify-between">
//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="px-6 py-2 bg-gray-400 text-white rounded-lg"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() => createRoom(roomName)}
//                   disabled={loading || !roomName}
//                   className={`px-6 py-2 bg-blue-600 text-white rounded-lg ${loading || !roomName ? "opacity-50 cursor-not-allowed" : ""}`}
//                 >
//                   {loading ? "Creating..." : "Create Room"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         <h2 className="text-3xl font-semibold text-gray-900 mb-6">Existing Rooms</h2>

//         {loading ? (
//           <div className="text-center text-gray-600">Loading rooms...</div>
//         ) : (
//           <ul className="space-y-6">
//             {rooms.length === 0 ? (
//               <li className="text-center text-gray-600">No rooms available.</li>
//             ) : (
//               rooms.map((room) => (
//                 <li
//                   key={room.id}
//                   className="bg-white p-6 rounded-lg shadow-lg hover:bg-gray-50 transition duration-300 transform hover:scale-105"
//                 >
//                   <a
//                     href={`/room/${room.id}`}
//                     className="text-xl font-medium text-blue-600 hover:underline"
//                   >
//                     {room.name || "Untitled Room"}
//                   </a>
//                 </li>
//               ))
//             )}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/navbar/Navbar";

// Define the constant for room data (this can be replaced with the fetched data later)
const roomsData = [
  { id: 1, name: "Room 1" },
  { id: 2, name: "Room 2" },
  { id: 3, name: "Room 3" },
  { id: 4, name: "Room 4" }
];

const Dashboard = () => {
  const [rooms, setRooms] = useState([]); // rooms will hold an array of room objects
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Use the constant roomsData initially (this can be replaced with fetch later)
    setRooms(roomsData); // Set rooms to the constant data
  }, []); // Empty dependency array to only run once on mount

  const createRoom = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/room", { method: "POST" });
      const data = await response.json();
      router.push(`/room/${data.roomId}`); // Navigate to the new room
    } catch (error) {
      console.error("Error creating room:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-teal-500 text-gray-800">
      <Navbar />
      <div className="max-w-5xl mx-auto py-10 px-6 bg-white shadow-xl rounded-lg mt-10">
        <h1 className="text-5xl font-semibold text-center text-gray-900 mb-8">
          Welcome to the Admin Dashboard
        </h1>

        <div className="flex justify-center mb-8">
          <button
            onClick={createRoom}
            disabled={loading}
            className={`px-8 py-4 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition duration-300 transform ${loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
          >
            {loading ? "Creating Room..." : "Create New Room"}
          </button>
        </div>

        <h2 className="text-3xl font-semibold text-gray-900 mb-6">Existing Rooms</h2>

        {loading ? (
          <div className="text-center text-gray-600">Loading rooms...</div>
        ) : (
          <ul className="space-y-6">
            {rooms.length === 0 ? (
              <li className="text-center text-gray-600">No rooms available.</li>
            ) : (
              rooms.map((room) => (
                <li
                  key={room.id}
                  className="bg-white p-6 rounded-lg shadow-lg hover:bg-gray-50 transition duration-300 transform hover:scale-105"
                >
                  <a
                    href={`/room/${room.id}`}
                    className="text-xl font-medium text-blue-600 hover:underline"
                  >
                    {room.name || "Untitled Room"}
                  </a>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;



