import express from "express";
import {
  createRoom,
  updateRoom,
  deleteRoom,
  getAllRooms,
  getRoomById,
  getAvailableRooms,
  getAvailableRoomsForListing,
} from "../controllers/room.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import {
  createRoomSchema,
  updateRoomSchema,
} from "../validators/room.validator.js";
import { validateBody } from "../middlewares/validate.middleware.js";

const router = express.Router();
router.get("/room/available", getAvailableRoomsForListing);
router.get("/room/search", getAvailableRooms);
router.get("/room", getAllRooms);
router.get("/room/:id", getRoomById);

router.post(
  "/room",
  authMiddleware,
  roleMiddleware("admin"),
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "gallery", maxCount: 20 },
  ]),

  createRoom,
);

router.put(
  "/room/:id",
  authMiddleware,
  roleMiddleware("admin", "receptionist"),
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "gallery", maxCount: 20 },
  ]),

  updateRoom,
);

router.delete("/room/:id", authMiddleware, roleMiddleware("admin"), deleteRoom);

export default router;
