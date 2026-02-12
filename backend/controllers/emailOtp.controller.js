import EmailOTP from "../models/EmailOTP.model.js";
import { sendEmailOTP } from "../services/mail.service.js";

export const sendOTPToEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await EmailOTP.deleteMany({ email });

    await EmailOTP.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) 
    });

    await sendEmailOTP({ email, otp });

    res.json({
      success: true,
      message: "OTP sent to email"
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmailOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const record = await EmailOTP.findOne({
      email,
      otp,
      expiresAt: { $gt: new Date() }
    });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP"
      });
    }

    record.verified = true;
    await record.save();

    res.json({
      success: true,
      message: "Email verified successfully"
    });
  } catch (error) {
    next(error);
  }
};
