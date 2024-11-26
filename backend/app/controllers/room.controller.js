const db = require("../models");  
const Room = db.rooms;  
const AllocatedRoom = db.allocatedRooms;  

const createRoom = async (req, res) => {
    try {
      const { name } = req.body;
      const userId = req.user.id; 
      // Validate room name
      if (!name) {
        return res.status(400).json({ error: "Room name is required" });
      }
      const newRoom = await Room.create({ name });
      // Allocate the new room to the current user
      await AllocatedRoom.create({ userId, roomId: newRoom.id });
  
      res.status(201).json({
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
    const { userId, roomId } = req.body;

    if (!userId || !roomId) {
      return res.status(400).json({ error: "User ID and Room ID are required" });
    }

    // Check if the room exists
    const room = await Room.findByPk(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Allocate the room to the user
    const allocation = await AllocatedRoom.create({ userId, roomId });

    // Return response with the allocation details
    res.status(201).json({ allocationId: allocation.id, message: "Room allocated successfully" });
  } catch (error) {
    console.error("Error allocating room:", error);
    res.status(500).json({ error: "Server error" });
  }
};


const getAllocatedRooms = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find all room allocations for the given userId
    const allocations = await AllocatedRoom.findAll({
      where: { userId },
      include: [{
        model: Room, 
        as: 'room',  
        attributes: ['id', 'name'],
      }],
    });

    if (allocations.length === 0) {
      return res.status(404).json({ message: "No rooms allocated for this user" });
    }

    // Map the allocations to include room details
    const rooms = allocations.map((allocation) => ({
      allocationId: allocation.id,
      roomId: allocation.roomId,
      roomName: allocation.room.name, 
    }));

    res.status(200).json(rooms);
  } catch (error) {
    console.error("Error fetching allocated rooms:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { createRoom, allocateRoom, getAllocatedRooms };
