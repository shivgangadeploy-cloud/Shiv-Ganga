import Joi from "joi";

export const createBookingSchema = Joi.object({
  roomId: Joi.string().required(),

  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),
  address: Joi.string().required(),
  specialRequest: Joi.string().allow(""),

  checkInDate: Joi.date().required(),
  checkOutDate: Joi.date().greater(Joi.ref("checkInDate")).required(),

  adults: Joi.number().min(1).required(),
  children: Joi.number().min(0).default(0),

  addOns: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      price: Joi.number().min(0).required(),
      quantity: Joi.number().min(1).required()
    })
  ).default([])
});
