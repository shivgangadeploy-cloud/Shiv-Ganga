import express from "express";
import { cancelBooking,sendInvoiceToWhatsApp,roomCheckIn,roomCheckOut} from "../controllers/checkInOut.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";


const router = express.Router();



// router.patch(
//   "/booking/:bookingId/check-in",
//   authMiddleware,
//   roleMiddleware("admin","receptionist"),
//   checkInBooking
// );

// router.patch(
//   "/booking/:bookingId/check-out",
//   authMiddleware,
//   roleMiddleware("admin","receptionist"),
//   checkOutBooking
// );


router.patch(
  "/booking/:bookingId/cancel",
  cancelBooking
);

router.post(
  "/booking/:bookingId/send-invoice-whatsapp",
  sendInvoiceToWhatsApp
);

router.patch(
  "/room/:roomId/check-in",
  authMiddleware,
  roleMiddleware("admin", "receptionist"),
  roomCheckIn
);

router.patch(
  "/room/:roomId/check-out",
  authMiddleware,
  roleMiddleware("admin", "receptionist"),
  roomCheckOut
);
export default router;
