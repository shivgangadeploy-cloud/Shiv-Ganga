import express from "express";
import { createContact } from "../controllers/contact.controller.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { createContactSchema } from "../validators/contact.validator.js";

const router = express.Router();

router.post(
  "/contact",
  validateBody(createContactSchema),
  createContact
);

export default router;
