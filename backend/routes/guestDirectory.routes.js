import express from "express";
import {
  getGuestStats,
  getGuestList,
  getGuestDetails,
  getGuestTransactions,
  exportGuestsToSheet,
  getGuestPaymentSummary,
  getGuestBookingHistory,
} from "../controllers/guestDirectory.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get(
  "/guests/stats",
  authMiddleware,
  roleMiddleware("admin", "receptionist"),
  getGuestStats
);

router.get(
  "/guests",
  authMiddleware,
  roleMiddleware("admin", "receptionist"),
  getGuestList
);

router.get(
  "/guests/:id/details",
  authMiddleware,
  roleMiddleware("admin", "receptionist"),
  getGuestDetails
);

router.get(
  "/guests/:id/transactions",
  authMiddleware,
  roleMiddleware("admin", "receptionist"),
  getGuestTransactions
);

router.get(
  "/guests/:id/bookings-history",
  authMiddleware,
  roleMiddleware("admin", "receptionist"),
  getGuestBookingHistory,
);

router.get(
  "/guests/:id/payment-summary",
  authMiddleware,
  roleMiddleware("admin", "receptionist"),
  getGuestPaymentSummary
);

router.get(
  "/guests/export",
  authMiddleware,
  roleMiddleware("admin"),
  exportGuestsToSheet
);

export default router;
