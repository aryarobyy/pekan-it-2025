import { useState, useEffect } from "react";
import Cookies from "js-cookie";

interface UseCookieConsentReturn {
  showCookieConsent: boolean;
  cookieConsentGiven: boolean;
  handleCookieConsent: (accepted: boolean) => void;
}

export const useCookieConsent = (cookieKey: string): UseCookieConsentReturn => {
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [cookieConsentGiven, setCookieConsentGiven] = useState(false);

  useEffect(() => {
    const consent = Cookies.get(cookieKey);
    if (consent === 'accepted') {
      setCookieConsentGiven(true);
    } else if (!consent) {
      setShowCookieConsent(true);
    }
  }, [cookieKey]);

  const handleCookieConsent = (accepted: boolean) => {
    Cookies.set(cookieKey, accepted ? 'accepted' : 'declined', {
      expires: 365,
      secure: true,
      sameSite: 'Lax',
    });
    setCookieConsentGiven(accepted);
    setShowCookieConsent(false);
  };

  return { showCookieConsent, cookieConsentGiven, handleCookieConsent };
};
