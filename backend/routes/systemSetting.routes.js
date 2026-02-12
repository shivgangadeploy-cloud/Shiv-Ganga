import express from "express";
import {
  getSystemSettings,
  upsertSystemSettings
} from "../controllers/systemSetting.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();


router.get(
  "/system-settings",
  authMiddleware,
  getSystemSettings
);


router.post(
  "/system-settings",
  authMiddleware,
  roleMiddleware("admin"),
  upload.single("logo"),
  upsertSystemSettings
);

export default router;
