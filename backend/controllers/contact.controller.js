import Contact from "../models/Contact.model.js";
import { sendContactMailToAdmin } from "../services/mail.service.js";

export const createContact = async (req, res, next) => {
  try {
    const { firstName, lastName, email, subject, message } = req.body;

    const contact = await Contact.create({
      firstName,
      lastName,
      email,
      subject,
      message
    });

   
    await sendContactMailToAdmin({
      name: `${firstName} ${lastName}`,
      email,
      subject,
      message
    });

    res.status(201).json({
      success: true,
      message: "Your message has been sent successfully",
      data: contact
    });
  } catch (error) {
    next(error);
  }
};
