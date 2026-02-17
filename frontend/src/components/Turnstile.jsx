import React, { useRef, useEffect, useState } from 'react';

const Turnstile = React.forwardRef(({ onVerify }, ref) => {
  const containerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [simToken, setSimToken] = useState(null);

  const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';

  useEffect(() => {
    if (!window.turnstile && TURNSTILE_SITE_KEY) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      script.onload = () => setIsReady(true);
      document.body.appendChild(script);
    } else if (window.turnstile) {
      setIsReady(true);
    }

    return () => {
      if (containerRef.current && window.turnstile) {
        try {
          window.turnstile.reset();
        } catch (e) {}
      }
    };
  }, [TURNSTILE_SITE_KEY]);

  useEffect(() => {
    if (isReady && containerRef.current && window.turnstile && TURNSTILE_SITE_KEY) {
      try {
        window.turnstile.render(containerRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: 'light',
          callback: (token) => {
            if (onVerify) onVerify(token);
          },
        });
      } catch (error) {
        console.error('Error rendering Turnstile:', error);
      }
    }
  }, [isReady, TURNSTILE_SITE_KEY, onVerify]);

  React.useImperativeHandle(ref, () => ({
    getToken: () => {
      if (TURNSTILE_SITE_KEY && window.turnstile && containerRef.current) {
        try {
          return window.turnstile.getResponse(containerRef.current);
        } catch {
          return null;
        }
      }
      return simToken;
    },
    reset: () => {
      if (TURNSTILE_SITE_KEY && window.turnstile && containerRef.current) {
        try {
          window.turnstile.reset(containerRef.current);
        } catch {}
      }
      setSimToken(null);
    },
  }));

  if (!TURNSTILE_SITE_KEY) {
    return (
      <div className="text-yellow-600 text-sm">
        Turnstile not configured. Set VITE_TURNSTILE_SITE_KEY.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="cf-turnstile flex justify-center my-4"
    />
  );
});

Turnstile.displayName = 'Turnstile';

export default Turnstile;
