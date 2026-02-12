import Joi from "joi";


export const adminRegisterSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).required(),

  email: Joi.string().email().required(),

  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be 10 digits"
    }),

  password: Joi.string()
    .min(6)
    .max(30)
    .required(),


  secretKey: Joi.string().required()
});

export const adminLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});


export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});



export const resetPasswordSchema = Joi.object({
  newPassword: Joi.string()
    .min(6)
    .max(30)
    .required()
    .messages({
      "string.min": "New password must be at least 6 characters"
    }),

  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "New password and confirm password do not match"
    })
});