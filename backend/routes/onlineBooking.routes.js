import express from "express";
import {
  createPaymentOrder,
  verifyPayment,
  fakeVerifyPayment,
  createRemainingPaymentOrder,
  verifyRemainingPayment,
  fakeVerifyRemainingPayment,
} from "../controllers/onlineBooking.controller.js";

const router = express.Router();

router.post("/online-booking/create-order", createPaymentOrder);
router.post("/online-booking/verify", verifyPayment);
router.post("/online-booking/fake-verify", fakeVerifyPayment);

router.post(
  "/online-booking/remaining/create-order",
  createRemainingPaymentOrder,
);
router.post("/online-booking/remaining/verify", verifyRemainingPayment);
router.post(
  "/online-booking/remaining/fake-verify",
  fakeVerifyRemainingPayment,
);

// Test endpoint for debugging
router.post("/online-booking/test-email", async (req, res) => {
  try {
    const { email } = req.body;
    const EmailOTP = (await import("../models/EmailOTP.model.js")).default;

    const otpRecord = await EmailOTP.findOne({
      email,
      verified: true,
    });

    res.status(200).json({
      success: true,
      email,
      verified: !!otpRecord,
      otpRecord,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;

// import express from "express";
// import {
//   createPaymentOrder,
//   verifyPayment,
//   fakeVerifyPayment,

//   createRemainingPaymentOrder,
//   verifyRemainingPayment,
//   fakeVerifyRemainingPayment

// } from "../controllers/onlineBooking.controller.js";

// const router = express.Router();

// router.post("/online-booking/create-order", createPaymentOrder);
// router.post("/online-booking/verify", verifyPayment);
// router.post("/online-booking/fake-verify", fakeVerifyPayment);

// router.post(
//   "/online-booking/remaining/create-order",
//   createRemainingPaymentOrder
// );

// router.post(
//   "/online-booking/remaining/verify",
//   verifyRemainingPayment
// );

// router.post(
//   "/online-booking/remaining/fake-verify",
//   fakeVerifyRemainingPayment
// );

// export default router;
