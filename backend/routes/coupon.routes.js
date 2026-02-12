import express from "express";
import {
  createCoupon,
  applyCoupon,
  disableCoupon,
  enableCoupon,
  getAllCouponsForReceptionist,
  getActiveCouponsForUser,
  updateCoupon,
  deleteCoupon,
  getAllCouponsForAdmin
} from "../controllers/coupon.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = express.Router();

// ADMIN ONLY
router.post(
  "/admin/coupon",
  authMiddleware,
  roleMiddleware("admin"),
  createCoupon
);

router.put(
  "/admin/coupon/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateCoupon
);

router.delete(
  "/admin/coupon/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteCoupon
);

router.patch(
  "/admin/coupon/:id/enable",
  authMiddleware,
  roleMiddleware("admin"),
  enableCoupon
);

router.patch(
  "/admin/coupon/:id/disable",
  authMiddleware,
  roleMiddleware("admin"),
  disableCoupon
);

router.get(
  "/admin/coupon",
  authMiddleware,
  roleMiddleware("admin"),
  getAllCouponsForAdmin
);

// RECEPTIONIST (AUTH REQUIRED)
router.get(
  "/receptionist/coupon",
  authMiddleware,
  roleMiddleware("receptionist"),
  getActiveCouponsForUser
);

router.post(
  "/receptionist/coupon/apply",
  authMiddleware,
  roleMiddleware("receptionist"),
  applyCoupon
);

// PUBLIC (NO AUTH)
router.get(
  "/public/coupon",
  getActiveCouponsForUser
);

router.post(
  "/public/coupon/apply",
  applyCoupon
);

export default router;
