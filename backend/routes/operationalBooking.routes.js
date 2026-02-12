import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import {
  getReceptionistBookingStats,
  getReceptionistBookings
} from "../controllers/operationalBooking.controller.js";

const router = express.Router();

router.get(
  "/receptionist/bookings/stats",
  authMiddleware,
  roleMiddleware("receptionist"),
  getReceptionistBookingStats
);

router.get(
  "/receptionist/bookings",
  authMiddleware,
  roleMiddleware("receptionist"),
  getReceptionistBookings
);

export default router;
