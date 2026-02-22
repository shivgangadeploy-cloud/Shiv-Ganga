/**
 * Cloudflare Turnstile CAPTCHA Verification Middleware (FIXED)
 */

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY;

export const verifyTurnstile = async (req, res, next) => {
  try {
    const { captchaToken } = req.body;

    // In production, token is required
    if (!captchaToken) {
      return res.status(400).json({
        success: false,
        message: "CAPTCHA verification is required",
      });
    }

    const verifyUrl =
      "https://challenges.cloudflare.com/turnstile/v0/siteverify";

    const response = await fetch(verifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: TURNSTILE_SECRET,
        response: captchaToken,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      console.error("Turnstile failed:", data);
      return res.status(400).json({
        success: false,
        message: "CAPTCHA verification failed",
      });
    }

    req.captchaData = data;
    next();
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Security verification failed",
    });
  }
};