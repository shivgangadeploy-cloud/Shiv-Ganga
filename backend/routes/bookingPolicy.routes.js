import {authMiddleware} from "../middlewares/auth.middleware.js"
import {roleMiddleware} from "../middlewares/role.middleware.js"
import { getBookingPolicy,upsertBookingPolicy,getPublicBookingPolicy} from "../controllers/bookingPolicy.controller.js";
import express from "express"
const router = express.Router()


router.get(
  "/booking-policy",
  authMiddleware,
  roleMiddleware("admin"),
  getBookingPolicy
);

router.post(
  "/booking-policy",
  authMiddleware,
  roleMiddleware("admin"),
  upsertBookingPolicy
);

router.get(
  "/public/booking-policy",
  getPublicBookingPolicy
);

export default router