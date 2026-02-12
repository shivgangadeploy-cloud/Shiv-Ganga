import express from "express";
import {
  getReceptionistNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  markNotificationAsUnread,
  deleteNotification,
} from "../controllers/notification.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get(
  "/notification",
  authMiddleware,
  roleMiddleware("receptionist", "admin"),
  getReceptionistNotifications,
);

router.get(
  "/notification/unread-count",
  authMiddleware,
  roleMiddleware("receptionist", "admin"),
  getUnreadNotificationCount,
);

router.patch(
  "/notification/:notificationId/read",
  authMiddleware,
  roleMiddleware("receptionist", "admin"),
  markNotificationAsRead,
);

router.patch(
  "/notification/:notificationId/unread",
  authMiddleware,
  roleMiddleware("receptionist", "admin"),
  markNotificationAsUnread,
);

router.patch(
  "/notification/read-all",
  authMiddleware,
  roleMiddleware("receptionist", "admin"),
  markAllNotificationsAsRead,
);
router.delete(
  "/notification/:id",
  authMiddleware,
  roleMiddleware("receptionist", "admin"),
  deleteNotification,
);

export default router;
