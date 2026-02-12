import express from "express";
import { createReceptionist,updateReceptionist,deleteReceptionist ,getAllStaff} from "../controllers/receptionist.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post(
  "/receptionist/register",
  authMiddleware,
  roleMiddleware("admin"),
  upload.single("document"),
  createReceptionist
);

router.put(
  "/receptionists/:id",
  authMiddleware,
  roleMiddleware("admin"),
  upload.single("document"),
  updateReceptionist
);

router.delete(
  "/receptionist/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteReceptionist
);

router.get(
  "/staff",
  authMiddleware,
  roleMiddleware("admin"),
  getAllStaff
);
export default router;
