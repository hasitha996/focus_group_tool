"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/navbar/Navbar";
import notifications from '../../components/alarts/alerts';
import { allocateToRoom, createNewRoom, fetchAllocatedRooms, deleteRoomwithUsers } from "../api/dasboard/route";
import { getAccessUser } from "@/app/utils/apiClient";


const Dashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [usersRoles, setUsersRoles] = useState([]); // Store user roles
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [selectedRoomName, setSelectedRoomName] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserEmail, setSelectedUserEmail] = useState('');
  const [selectedUserRole, setSelectedUserRole] = useState(""); // Store selected user role
  const [inviteSuccess, setInviteSuccess] = useState(false); // Track invite success
  const [roomLink, setRoomLink] = useState(""); // Store room link
  const router = useRouter();
  const userData = getAccessUser();

  console.log(userData);
  if (!userData) {
    throw new Error("User  data is missing or invalid");
  }

  const AuthUserId = userData.id;

  useEffect(() => {
    const loadRoomsAndUsers = async () => {
      setLoading(true);
      try {
        const response = await fetchAllocatedRooms();
        setRooms(response.data.rooms || []); // Assuming data is an array of rooms
        setUsers(response.data.users || []);
        setUsersRoles(response.data.user_role || []); // Set user roles
      } catch (error) {
        notifications.error("Failed to fetch rooms and users");
      } finally {
        setLoading(false);
      }
    };

    loadRoomsAndUsers();
  }, []);

  const createRoom = async (name) => {
    setLoading(true);
    try {
      const data = await createNewRoom(name);
      if (data) {
        setShowModal(false);
        notifications.success("Room created successfully");
        setRoomName('');
        router.push(`/room/${data.roomId}/${name}`);
      } else {
        notifications.error("Failed to create room");
      }
    } catch (error) {
      notifications.error("Error creating room");
    } finally {
      setLoading(false);
    }
  };

  const inviteUser = async () => {
    console.log(selectedRoomId);
    if (!selectedRoomId || !selectedUserId || !selectedUserRole || !selectedRoomName || !selectedUserEmail) {
      notifications.error("Please select a user, room, and role");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Allocate the user to the room
      const response = await allocateToRoom(selectedRoomId, selectedUserId, selectedUserRole);
      if (response) {
        notifications.success("User invited successfully");
        setInviteSuccess(true);

        // Step 2: Set the room link (assuming `selectedRoomId` and `selectedRoomName` are available)
        const roomLink = `${window.location.origin}/room/${selectedRoomId}/${selectedRoomName}`;
        setRoomLink(roomLink);

        // Step 3: Send the email invitation with the link to the room
        const emailResponse = await sendInviteEmail(selectedUserEmail, roomLink);
        if (emailResponse) {
          notifications.success("Invitation email sent successfully!");
        } else {
          notifications.error("Failed to send invitation email");
        }

      } else {
        notifications.error("Failed to invite user");
      }
    } catch (error) {
      notifications.error("Error inviting user");
    } finally {
      setLoading(false);
    }
  };

  const sendInviteEmail = async (userEmail, roomLink) => {
    try {
      const response = await fetch('/api/room/invite-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail, roomLink }),
      });


      if (!response) {
        const result = await response.json();
        console.error('Error sending email:', result.message);
        return;
      }
      const result = await response.json();
      return true;

    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };




  const copyRoomLink = () => {
    navigator.clipboard.writeText(roomLink);
    notifications.success("Room link copied to clipboard");
    setShowInviteModal(false);
    setSelectedRoomId(false);
    setSelectedUserId(false);
    setInviteSuccess(false);
  };

  const handleUserChange = (e) => {
    const selectedId = e.target.value;
    setSelectedUserId(selectedId);
    const selectedUser = users.find((user) => user.id === parseInt(selectedId));
    setSelectedUserEmail(selectedUser?.email || '');
  };

  const deleteRoom = async (roomId, roomName) => {
    const confirmDelete = confirm("Are you sure you want to delete this room?");
    if (!confirmDelete) return;

    setLoading(true);
    try {

      const roomDeleted = await deleteRoomwithUsers(roomId, roomName);

      if (roomDeleted) {
        notifications.success("Room deleted successfully");

        // Remove room from the state
        setRooms((prevRooms) => prevRooms.filter((room) => room.roomId !== roomId));


        const response = await fetch('/api/room/delete-room', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ roomId }),
        });

        if (response.ok) {
          const disconnectResponse = await response.json();

          if (disconnectResponse) {
            notifications.success("All users disconnected successfully");
          } else {
            notifications.warning("Room deleted, but some users may not have been disconnected.");
          }
        } else {
          const errorData = await response.json();
          notifications.error(`Error disconnecting users`);
        }
      } else {
        notifications.error("Failed to delete room");
      }
    } catch (error) {
      console.error("Error deleting room:", error);
      notifications.error("An error occurred while deleting the room.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-teal-500 text-gray-800">
      <Navbar />
      <div className="max-w-5xl mx-auto py-10 px-6 bg-white shadow-xl rounded-lg mt-10">
        <h1 className="text-5xl font-semibold text-center text-gray-900 mb-8">
          Welcome to the  Focus Group tool
        </h1>

        <div className="flex justify-center mb-8">
          {AuthUserId == 1 && (
            <button
              onClick={() => setShowModal(true)}
              disabled={loading}
              className={`px-8 py-4 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition duration-300 transform ${loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
            >
              {loading ? "Creating Room..." : "Create New Room"}
            </button>
          )}

        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h2 className="text-2xl font-semibold text-center text-gray-900 mb-4">Enter Room Name</h2>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                placeholder="Room name"
              />
              <div className="flex justify-between">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 bg-gray-400 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => createRoom(roomName)}
                  disabled={loading || !roomName}
                  className={`px-6 py-2 bg-blue-600 text-white rounded-lg ${loading || !roomName ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {loading ? "Creating..." : "Create Room"}
                </button>
              </div>
            </div>
          </div>
        )}

        <h2 className="text-3xl font-semibold text-gray-900 mb-6">Existing Rooms</h2>

        {loading ? (
          <div className="text-center text-gray-600">Loading rooms...</div>
        ) : (
          <ul className="space-y-6">
            {rooms.length === 0 ? (
              <li className="text-center text-gray-600">No rooms available.</li>
            ) : (
              rooms.map((room) => (
                <li key={room.allocationId} className="bg-white p-6 rounded-lg shadow-lg hover:bg-gray-50 transition duration-300 transform hover:scale-105">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-xl font-medium text-blue-600">
                        Room Name: {room.roomName || "Untitled Room"}
                      </h3>
                      <p className="text-gray-600">Room ID: {room.roomId}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      {room.roomUserRoleId == 4 && (
                        <button
                          onClick={() => {
                            setSelectedRoomId(room.roomId);
                            setSelectedRoomName(room.roomName);
                            setShowInviteModal(true);
                          }}
                          className="text-green-600 font-semibold hover:underline"
                        >
                          Invite User
                        </button>
                      )}
                      <a
                        href={`/room/${room.roomId}/${room.roomName}`}
                        className="text-blue-600 hover:underline"
                      >
                        View Room
                      </a>
                      {room.roomUserRoleId == 4 && (
                        <button
                          onClick={() => {
                            deleteRoom(room.roomId, room.roomName)
                          }}
                          className="text-red-600 font-semibold hover:underline"
                        >
                          Delete Room
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        )}

        {showInviteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-2xl font-semibold text-center text-gray-900 mb-4">Select User to Invite</h2>
              <h3 className="text-2xl font-semibold text-center text-gray-900 mb-4">Room : {selectedRoomName}</h3>

              <select
                value={selectedUserId}
                onChange={handleUserChange}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>


              {/* User Role Dropdown */}
              <select
                value={selectedUserRole}
                onChange={(e) => setSelectedUserRole(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              >
                <option value="">Select a role</option>
                {usersRoles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>

              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setShowInviteModal(false);
                    setSelectedRoomId('');
                    setSelectedRoomName('');
                    setInviteSuccess(false);
                  }}
                  className="px-6 py-2 bg-gray-400 text-white rounded-lg"
                >
                  Cancel
                </button>

                {/* Show 'Copy Room Link' button if invite was successful */}
                {inviteSuccess && roomLink && (
                  <div className="flex justify-between">
                    <button
                      onClick={copyRoomLink}
                      className="px-6 py-2 bg-green-400 text-white rounded-lg"
                    >
                      Copy Room Link
                    </button>
                  </div>
                )}

                {/* Otherwise show 'Invite User' button */}
                {!inviteSuccess && (
                  <button
                    onClick={inviteUser}
                    disabled={loading || !selectedUserId || !selectedUserRole || !selectedRoomName}
                    className={`px-6 py-2 bg-blue-600 text-white rounded-lg ${loading || !selectedUserId || !selectedUserRole ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {loading ? "Inviting..." : "Invite User"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}



      </div>
    </div>
  );
};

export default Dashboard;
