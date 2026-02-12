import express from "express";
import {
  processStaffSalary,
  getStaffPayments,
  getStaffPaymentStats,
  payStaffSalary,
  getAllStaffWithSalaryStatus
} from "../controllers/staffSalary.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
const router = express.Router();




router.post(
  "/staff-salary/payout",
  authMiddleware,
  roleMiddleware("admin"),
  payStaffSalary
);



router.post(
  "/staff-salary/process",
  authMiddleware,
  roleMiddleware("admin"),
  processStaffSalary
);

router.get(
  "/staff-salary",
  authMiddleware,
  roleMiddleware("admin"),
  getStaffPayments
);

router.get(
  "/staff-salary/stats",
  authMiddleware,
  roleMiddleware("admin"),
  getStaffPaymentStats
);



router.get(
  "/staff-salary/staff-list",
  authMiddleware,
  roleMiddleware("admin"),
  getAllStaffWithSalaryStatus
);


export default router;

