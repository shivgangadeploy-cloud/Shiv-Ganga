// import express from "express";
// import {
//   getReceptionistOverview,
//   getTodayStats,
//   getWeeklyBookingTrends,
//   getRecentActivities,
//   getLatestBookings,
//   getGuestDirectory,
//   getInHouseGuests,
//   getGuestDetails
// } from "../controllers/receptionistDashboard.controller.js";
// import { authMiddleware } from "../middlewares/auth.middleware.js";
// import { roleMiddleware } from "../middlewares/role.middleware.js";

// const router = express.Router();

// router.get("/receptionist/overview", authMiddleware, roleMiddleware("receptionist"), getReceptionistOverview);
// router.get("/receptionist/today-stats", authMiddleware, roleMiddleware("receptionist"), getTodayStats);
// router.get("/receptionist/weekly-trends", authMiddleware, roleMiddleware("receptionist"), getWeeklyBookingTrends);
// router.get("/receptionist/recent-activities", authMiddleware, roleMiddleware("receptionist"), getRecentActivities);
// router.get("/receptionist/latest-bookings", authMiddleware, roleMiddleware("receptionist"), getLatestBookings);
// router.get(
//   "/receptionist/guests",
//   authMiddleware,
//   roleMiddleware("receptionist"),
//   getGuestDirectory
// );

// router.get(
//   "/receptionist/guests/in-house",
//   authMiddleware,
//   roleMiddleware("receptionist"),
//   getInHouseGuests
// );

// router.get(
//   "/receptionist/guests/:guestId",
//   authMiddleware,
//   roleMiddleware("receptionist"),
//   getGuestDetails
// );
// export default router;

import express from "express";
import {
  getReceptionistOverview,
  getTodayStats,
  getWeeklyBookingTrends,
  getRecentActivities,
  getLatestBookings,
  getGuestDirectory,
  getInHouseGuests,
  getGuestDetails,
  // 👇 YE 2 FUNCTIONS ADD KARO IMPORT MEIN
  updateBooking,
  deleteBooking
} from "../controllers/receptionistDashboard.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/receptionist/overview", authMiddleware, roleMiddleware("receptionist"), getReceptionistOverview);
router.get("/receptionist/today-stats", authMiddleware, roleMiddleware("receptionist"), getTodayStats);
router.get("/receptionist/weekly-trends", authMiddleware, roleMiddleware("receptionist"), getWeeklyBookingTrends);
router.get("/receptionist/recent-activities", authMiddleware, roleMiddleware("receptionist"), getRecentActivities);
router.get("/receptionist/latest-bookings", authMiddleware, roleMiddleware("receptionist"), getLatestBookings);
router.get("/receptionist/guests", authMiddleware, roleMiddleware("receptionist"), getGuestDirectory);
router.get("/receptionist/guests/in-house", authMiddleware, roleMiddleware("receptionist"), getInHouseGuests);
router.get("/receptionist/guests/:guestId", authMiddleware, roleMiddleware("receptionist"), getGuestDetails);

// 👇 YE 2 ROUTES ADD KARO
router.put("/receptionist/bookings/:id", authMiddleware, roleMiddleware("receptionist"), updateBooking);
router.delete("/receptionist/bookings/:id", authMiddleware, roleMiddleware("receptionist"), deleteBooking);

export default router;
