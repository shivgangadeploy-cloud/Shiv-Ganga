import crypto from 'crypto';
import { config } from '../configs/env.js';

const CAPTCHA_SECRET = config.JWT_SECRET || 'default_secret_key_change_me';

export const verifyCaptcha = (req, res, next) => {
  try {
    const { captchaToken, captchaAnswer } = req.body;

    if (!captchaToken || !captchaAnswer) {
      return res.status(400).json({
        success: false,
        message: 'CAPTCHA verification is required'
      });
    }

    const [salt, hash] = captchaToken.split(':');

    if (!salt || !hash) {
      return res.status(400).json({
        success: false,
        message: 'Invalid CAPTCHA token'
      });
    }

    const expectedHash = crypto
      .createHmac('sha256', CAPTCHA_SECRET)
      .update(salt + captchaAnswer.toString())
      .digest('hex');

    if (hash !== expectedHash) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect CAPTCHA answer'
      });
    }

    next();
  } catch (error) {
    console.error('Captcha verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'CAPTCHA verification failed'
    });
  }
};
