import crypto from 'crypto';
import { config } from '../configs/env.js';

const CAPTCHA_SECRET = config.JWT_SECRET || 'default_secret_key_change_me';

export const generateCaptcha = (req, res) => {
  try {
    const num1 = Math.floor(Math.random() * 10) + 1; // 1-10
    const num2 = Math.floor(Math.random() * 10) + 1; // 1-10
    const answer = num1 + num2;

    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
      .createHmac('sha256', CAPTCHA_SECRET)
      .update(salt + answer.toString())
      .digest('hex');

    const token = `${salt}:${hash}`;

    res.status(200).json({
      success: true,
      question: `${num1} + ${num2} = ?`,
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate CAPTCHA'
    });
  }
};
