import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";

const Turnstile = forwardRef(({ onVerify }, ref) => {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const tokenRef = useRef(null);

  const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

  // Load script only once
  useEffect(() => {
    if (!SITE_KEY) return;

    if (!window.turnstile && !document.getElementById("cf-turnstile-script")) {
      const script = document.createElement("script");
      script.id = "cf-turnstile-script";
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, [SITE_KEY]);

  // Render widget (safe)
  useEffect(() => {
    if (!SITE_KEY) return;

    const interval = setInterval(() => {
      if (
        window.turnstile &&
        containerRef.current &&
        widgetIdRef.current === null
      ) {
        widgetIdRef.current = window.turnstile.render(
          containerRef.current,
          {
            sitekey: SITE_KEY,
            theme: "light",
            callback: (token) => {
              tokenRef.current = token;
              onVerify?.(token);
            },
          }
        );
        clearInterval(interval);
      }
    }, 100);

    return () => {
      clearInterval(interval);
      if (window.turnstile && widgetIdRef.current !== null) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {}
        widgetIdRef.current = null;
      }
    };
  }, [SITE_KEY, onVerify]);

  useImperativeHandle(ref, () => ({
    getToken: () => tokenRef.current,
    reset: () => {
      if (window.turnstile && widgetIdRef.current !== null) {
        try {
          window.turnstile.reset(widgetIdRef.current);
        } catch {}
        tokenRef.current = null;
      }
    },
  }));

  if (!SITE_KEY) {
    return (
      <div className="text-yellow-600 text-sm">
        Turnstile not configured
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex justify-center my-4 w-full"
      style={{ minHeight: 65 }}
    />
  );
});

Turnstile.displayName = "Turnstile";
export default Turnstile;