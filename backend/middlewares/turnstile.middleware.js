/**
 * Cloudflare Turnstile CAPTCHA Verification Middleware
 * Verifies the Turnstile token from client-side submission
 */

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY || '';

export const verifyTurnstile = async (req, res, next) => {
  try {
    const { captchaToken } = req.body;

    // Skip verification in development if secret not set
    if (process.env.NODE_ENV === 'development' && !TURNSTILE_SECRET) {
      console.warn('⚠️ TURNSTILE_SECRET_KEY not set - skipping verification in development');
      return next();
    }

    // In production, require token
    if (!captchaToken) {
      return res.status(400).json({
        success: false,
        message: 'CAPTCHA verification is required'
      });
    }

    // Verify token with Cloudflare Turnstile API
    const verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    const response = await fetch(verifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: TURNSTILE_SECRET,
        response: captchaToken
      })
    });

    const data = await response.json();

    if (!data.success) {
      return res.status(400).json({
        success: false,
        message: 'CAPTCHA verification failed. Please try again.'
      });
    }

    // Attach verification data to request for logging
    req.captchaData = {
      success: true,
      challengeTimestamp: data.challenge_ts,
      hostname: data.hostname,
      errorCodes: data['error-codes'] || []
    };

    next();
  } catch (error) {
    console.error('Turnstile verification error:', error.message);
    
    if (process.env.NODE_ENV === 'production') {
      return res.status(500).json({
        success: false,
        message: 'Security verification failed. Please try again.'
      });
    }
    
    next(); // In dev, allow to continue
  }
};
