

import Newsletter from "../models/Newsletter.model.js";
import { sendSubscriptionConfirmationMail, sendAdminNewSubscriberMail } from "../services/mail.service.js";

export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const exists = await Newsletter.findOne({ email });

    if (exists) {
      return res.status(409).json({
        message: "You are already subscribed",
      });
    }

    await Newsletter.create({ email });

    // Send confirmation email to subscriber
    try {
      await sendSubscriptionConfirmationMail(email);
    } catch (e) {
      console.error("Failed to send subscription confirmation email:", e);
    }

    // Notify admin of new subscriber
    try {
      await sendAdminNewSubscriberMail({ email });
    } catch (e) {
      console.error("Failed to notify admin of new subscriber:", e);
    }

    return res.status(201).json({
      message: "Thank you for subscribing!",
    });
  } catch (error) {
    console.error("Newsletter Error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};