import express from "express";
import {
  getReceptionistProfile,
  updateReceptionistProfile
} from "../controllers/receptionistProfile.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = express.Router();


router.get(
  "/receptionist/profile",
  authMiddleware,
  roleMiddleware("receptionist"),
  getReceptionistProfile
);


router.put(
  "/receptionist/profile",
  authMiddleware,
  roleMiddleware("receptionist"),
  updateReceptionistProfile
);


export default router;
