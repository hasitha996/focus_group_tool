// const express = require('express');
// const router = express.Router();
// const { createRoom, allocateRoom, getAllocatedRooms } = require('../controllers/room.controller');

// router.use((req, res, next) => {
//     res.header(
//         "Access-Control-Allow-Headers",
//         "x-access-token, Origin, Content-Type, Accept"
//     );
//     next();
// });

// // Create a new room
// router.post('/api/create_room', createRoom);

// // Allocate a room to a user
// router.post('/api/allocate_room', allocateRoom);

// // Get allocated rooms for a specific user
// router.get('/api/allocated_rooms/:userId', getAllocatedRooms);

// module.exports = router;

const express = require("express");
const router = express.Router();

const { authJwt } = require("../middleware");
const { createRoom, allocateRoom, getAllocatedRooms } = require("../controllers/room.controller");

// router.post("/create_room", [authJwt.verifyToken], createRoom);
// router.post("/allocate_room", [authJwt.verifyToken], allocateRoom);
// router.get("/allocated_rooms", [authJwt.verifyToken], getAllocatedRooms);


// Route to create a new room
router.post("/create_room/:userId", createRoom);

// Route to allocate a user to a room
router.post("/allocate_room",  allocateRoom);

// Route to get allocated rooms for a specific user
router.get("/allocated_rooms/:userId", getAllocatedRooms);

module.exports = router;
