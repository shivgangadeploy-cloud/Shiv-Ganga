import express from "express";
import {
  getSalaryReportList,
  getPayrollStats,
  getSalaryHistory
} from "../controllers/staffReport.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get(
  "/staff-reports",
  authMiddleware,
  roleMiddleware("admin"),
  getSalaryReportList
);

router.get(
  "/staff-reports/stats",
  authMiddleware,
  roleMiddleware("admin"),
  getPayrollStats
);

router.get(
  "/staff-reports/history",
  authMiddleware,
  roleMiddleware("admin"),
  getSalaryHistory
);


export default router;
