import express from "express";
import {
  createTestimonial,
  getApprovedTestimonials,
  approveTestimonial,
  getTestimonialsByRoom,
  getBookingForReview
} from "../controllers/testimonial.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = express.Router();
router.post("/testimonial", createTestimonial);

router.get("/testimonial", getApprovedTestimonials);

router.get("/testimonial/room/:roomId", getTestimonialsByRoom);

router.patch(
  "/testimonial/:id/approve",
  authMiddleware,
  roleMiddleware("admin"),
  approveTestimonial
);
router.get("/testimonial/booking", getBookingForReview);

export default router;
