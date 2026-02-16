import express from "express";
import rateLimit from "express-rate-limit";
import {
  registerAdmin,
  login,
  forgotPassword,
  resetPassword
} from "../controllers/auth.controller.js";

import {
  adminRegisterSchema,
  adminLoginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from "../validators/auth.validator.js";

import { validateBody } from "../middlewares/validate.middleware.js";

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  message: "Too many login attempts, please try again later.",
});

router.post(
  "/auth/register",
  authLimiter,
  validateBody(adminRegisterSchema),
  registerAdmin
);

router.post(
  "/auth/login",
  authLimiter,
  validateBody(adminLoginSchema),
  login
);

router.post(
  "/auth/forgot-password",
  authLimiter,
  validateBody(forgotPasswordSchema),
  forgotPassword
);

router.post(
  "/auth/reset-password/:token",
  validateBody(resetPasswordSchema),
  resetPassword
);

export default router;
