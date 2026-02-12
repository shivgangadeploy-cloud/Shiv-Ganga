import express from "express";
import {
  addGalleryImage,
  getGalleryImages,
  deleteGalleryImage
} from "../controllers/gallery.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

/* PUBLIC */
router.get("/gallery", getGalleryImages);

/* ADMIN */
router.post(
  "/gallery",
  authMiddleware,
  roleMiddleware("admin"),
  upload.single("image"),
  addGalleryImage
);

router.delete(
  "/gallery/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteGalleryImage
);

export default router;