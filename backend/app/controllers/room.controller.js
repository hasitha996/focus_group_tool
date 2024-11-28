const { Sequelize, Op } = require('sequelize');
const db = require("../models");  
const Room = db.rooms;  
const User = db.user;
const Role = db.role;
const AllocatedRoom = db.allocatedRooms;  

const createRoom = async (req, res) => {
    try {
      const { name } = req.body;
      const userId = req.userId; 
      const roomUserRoleId = 4; 
      // Validate room name
      if (!name) {
        return res.status(400).json({ error: "Room name is required" });
      }
      const newRoom = await Room.create({ name });
      // Allocate the new room to the current user
      await AllocatedRoom.create({ userId, roomId: newRoom.id,roomUserRoleId });
  
      res.status(200).json({
        roomId: newRoom.id,
        message: "Room created and allocated to the current user successfully",
      });
    } catch (error) {
      console.error("Error creating and allocating room:", error);
      res.status(500).json({ error: "Server error" });
    }
  };
  
  const allocateRoom = async (req, res) => {
    try {
      
      const { selectedRoomId, selectedUserId, selectedUserRole } = req.body;
      if (!selectedUserId || !selectedRoomId) {
        return res.status(400).json({ error: "User ID and Room ID are required" });
      }
  
      // Check if the room exists
      const room = await Room.findByPk(selectedRoomId);
      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }
  
      // Check if the user is already allocated to the selected room
      const existingAllocation = await AllocatedRoom.findOne({
        where: {
          userId: selectedUserId,
          roomId: selectedRoomId,
        }
      });
      if (existingAllocation) {
        // Delete the existing allocation 
        await existingAllocation.destroy();
      }
  
      const allocation = await AllocatedRoom.create({
        userId: selectedUserId,
        roomId: selectedRoomId,
        roomUserRoleId: selectedUserRole,
      });

      res.status(200).json({ allocationId: allocation.id, message: "Room allocated successfully" });
    } catch (error) {
      console.error("Error allocating room:", error);
      res.status(500).json({ error: "Server error" });
    }
  };
  
  


const getAllocatedRooms = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Find all room allocations for the given userId
    const allocations = await AllocatedRoom.findAll({
      where: { userId },
      include: [{
        model: Room,
        as: 'room',
        attributes: ['id', 'name'],
      }],
    });


  // Fetch all users excluding the current user
  const users = await User.findAll({
    attributes: ['id', 'name', 'email', 'image', 'user_role_id'],
    where: {
      id: {
        [Sequelize.Op.ne]: userId  
      }
    },
    order: [['createdAt', 'DESC']],
  });


    const rooms = allocations.map((allocation) => ({
      allocationId: allocation.id,
      roomId: allocation.roomId,
      roomName: allocation.room.name,
      roomUserRoleId:allocation.roomUserRoleId
    }));

    const user_role = await Role.findAll({
      where: {
        id: {
          [Sequelize.Op.ne]: 4
        }
      }
    });
    

    res.status(200).json({
      message: 'Rooms and user list fetched successfully',
      data: {
        rooms: rooms.length > 0 ? rooms : [],
        users:users.length > 0 ? users : [],
        user_role:user_role.length > 0 ? user_role : []
      },
    });
  } catch (error) {
    console.error("Error fetching allocated rooms and user list:", error);
    res.status(500).json({ error: "Server error" });
  }
};
const deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.body;

    if (!roomId) {
      return res.status(400).json({ error: "Room ID is required" });
    }

    // Check if the room exists
    const room = await Room.findByPk(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Delete all allocations associated with the room
    await AllocatedRoom.destroy({
      where: { roomId }
    });

    // Delete the room
    await room.destroy();

    res.status(200).json({ message: "Room and associated allocations deleted successfully" });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getAllocatedRole = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.userId;
      console.log('asahs');
    if (!roomId || !userId) {
      return res.status(400).json({ error: "Room ID and User ID are required" });
    }

    // Find the allocated role for the given userId in the specific roomId
    const allocation = await AllocatedRoom.findOne({
      where: { roomId, userId },
      include: [{
        model: Room,
        as: 'room',
        attributes: ['id', 'name'],
      }],
    });

    if (!allocation) {
      return res.status(404).json({ error: 'Allocation not found for this user in the room' });
    }

    const role = await Role.findOne({
      where: { id: allocation.roomUserRoleId }, 
    });

    if (!role) {
      return res.status(404).json({ error: 'Role not found for this user in the room' });
    }

  
    return res.status(200).json({
      message: 'User role in room fetched successfully',
      data: {
        roomId: allocation.roomId,
        roomName: allocation.room.name,
        userId,
        userRole: role.name,
      },
    });
  } catch (error) {
    console.error("Error fetching allocated role:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
module.exports = { createRoom, allocateRoom, getAllocatedRooms,deleteRoom,getAllocatedRole };
