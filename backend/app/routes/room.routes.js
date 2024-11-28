const express = require("express");
const router = express.Router();

const { authJwt } = require("../middleware");
const { createRoom, allocateRoom, getAllocatedRooms,deleteRoom,getAllocatedRole } = require("../controllers/room.controller");

router.post("/create_room", [authJwt.verifyToken], createRoom);
router.post("/allocate_room", [authJwt.verifyToken], allocateRoom);
router.get("/allocated_rooms", [authJwt.verifyToken], getAllocatedRooms);
router.get('/room_role/:roomId', [authJwt.verifyToken],getAllocatedRole);
router.delete("/delete_room", [authJwt.verifyToken], deleteRoom);


module.exports = router;
