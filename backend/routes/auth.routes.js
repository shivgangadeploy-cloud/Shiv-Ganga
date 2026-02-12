import express from "express";
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

router.post(
  "/auth/register",
  validateBody(adminRegisterSchema),
  registerAdmin
);

router.post(
  "/auth/login",
  validateBody(adminLoginSchema),
  login
);

router.post(
  "/auth/forgot-password",
  validateBody(forgotPasswordSchema),
  forgotPassword
);

router.post(
  "/auth/reset-password/:token",
  validateBody(resetPasswordSchema),
  resetPassword
);

export default router;
