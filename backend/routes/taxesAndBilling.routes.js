import express from "express";
import {
  getTaxesAndBillingSettings,
  updateTaxesAndBillingSettings,
  createTaxesAndBillingSettings
} from "../controllers/taxesAndBilling.controller.js";

import {authMiddleware} from "../middlewares/auth.middleware.js";
import {roleMiddleware }from "../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/taxes-billing",
  authMiddleware,
  roleMiddleware("admin"),
  createTaxesAndBillingSettings
);

router.get(
  "/taxes-billing",
  authMiddleware,
  roleMiddleware("admin"),
  getTaxesAndBillingSettings
);

router.put(
  "/taxes-billing",
  authMiddleware,
  roleMiddleware("admin"),
  updateTaxesAndBillingSettings
);

export default router;
