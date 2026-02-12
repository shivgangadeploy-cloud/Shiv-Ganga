import express from "express";
import {
 
  createOfflineBooking,
  cancelOfflineBooking,
  createOfflinePaymentOrder,
  verifyOfflinePayment,
  fakeVerifyOfflinePayment,
  getBookingReceipt
} from "../controllers/offlineBooking.controller.js";
import { getAvailableRooms } from "../controllers/room.controller.js";
import {
  createRemainingPaymentOrder,
  verifyRemainingPayment,
  fakeVerifyRemainingPayment
} from "../controllers/onlineBooking.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get(
  "/offline-booking/available-rooms",
  authMiddleware,
  roleMiddleware("receptionist"),
  getAvailableRooms
);

router.post(
  "/offline-booking/cash",
  authMiddleware,
  roleMiddleware("receptionist"),
  createOfflineBooking
);

router.post(
  "/offline-booking/create-order",
  authMiddleware,
  roleMiddleware("receptionist"),
  createOfflinePaymentOrder
);

router.post(
  "/offline-booking/verify-payment",
  authMiddleware,
  roleMiddleware("receptionist"),
  verifyOfflinePayment
);

router.post(
  "/offline-booking/fake-verify-payment",
  authMiddleware,
  roleMiddleware("receptionist"),
  fakeVerifyOfflinePayment
);
router.get(
  "/offline-booking/receipt/:id",
  authMiddleware,
  roleMiddleware("receptionist"),
  getBookingReceipt
);

router.post(
  "/offline-booking/remaining/create-order",
  authMiddleware,
  roleMiddleware("receptionist"),
  createRemainingPaymentOrder
);

router.post(
  "/offline-booking/remaining/verify-payment",
  authMiddleware,
  roleMiddleware("receptionist"),
  verifyRemainingPayment
);

router.post(
  "/offline-booking/remaining/fake-verify-payment",
  authMiddleware,
  roleMiddleware("receptionist"),
  fakeVerifyRemainingPayment
);

router.patch(
  "/offline-booking/:bookingId/cancel",
  authMiddleware,
  roleMiddleware("receptionist"),
  cancelOfflineBooking
);

export default router;
