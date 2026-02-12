import express from "express";
import {
  sendOTPToEmail,
  verifyEmailOTP
} from "../controllers/emailOtp.controller.js";

const router = express.Router();

router.post("/otp/send", sendOTPToEmail);
router.post("/otp/verify", verifyEmailOTP);

export default router;
