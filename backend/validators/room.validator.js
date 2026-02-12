import Joi from "joi";

const roomCategories = [
  "Single Bedroom",
  "Deluxe Double AC",
  "Exclusive Triple",
  "Single AC Room",
  "Deluxe River View Room",
  "Grand Family Suite",
];

const roomTypes = ["Standard", "Deluxe", "Triple", "Family"];

const roomStatuses = ["Available", "Occupied", "Maintenance"];

/* ================= CREATE ROOM ================= */

export const createRoomSchema = Joi.object({
  roomNumber: Joi.string().trim().required(),

  name: Joi.string().trim().required(),

  type: Joi.string()
    .valid(...roomTypes)
    .required(),

  category: Joi.string()
    .valid(...roomCategories)
    .required(),

  description: Joi.string().allow("").max(1000),

  pricePerNight: Joi.number().positive().required(),

  roomSize: Joi.string().trim().required(),

  capacityAdults: Joi.number().integer().min(1).required(),

  capacityChildren: Joi.number().integer().min(0).default(0),

  features: Joi.array().items(Joi.string()).default([]),

  status: Joi.string()
    .valid(...roomStatuses)
    .default("available"),
});

export const updateRoomSchema = Joi.object({
  roomNumber: Joi.string().trim(),

  name: Joi.string().trim(),

  type: Joi.string().valid(...roomTypes),

  category: Joi.string().valid(...roomCategories),

  description: Joi.string().allow("").max(1000),

  pricePerNight: Joi.number().positive(),

  roomSize: Joi.string().trim(),

  capacityAdults: Joi.number().integer().min(1),

  capacityChildren: Joi.number().integer().min(0),

  features: Joi.array().items(Joi.string()),

  status: Joi.string().valid(...roomStatuses),
});
