import React from 'react';
import { X, Check } from 'lucide-react';

interface PomoConsentBannerProps {
  showCookieConsent: boolean;
  handleCookieConsent: (accepted: boolean) => void;
  cookieConsentGiven: boolean; 
}

const PomoConsentBanner: React.FC<PomoConsentBannerProps> = ({
  showCookieConsent,
  handleCookieConsent,
  cookieConsentGiven,
}) => {
  return (
    <>
      {showCookieConsent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 relative">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Cookie Consent
              </h3>

              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                We use cookies and local storage to save your Pomodoro timer progress.
                This helps us restore your session when you return to the page.
                <br /><br />
                <strong>What we save:</strong>
                <br />• Timer state (minutes, seconds)
                <br />• Current cycle and break status
                <br />• User session data
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => handleCookieConsent(false)}
                  className="flex-1 px-4 py-3 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <X size={18} />
                  Decline
                </button>

                <button
                  onClick={() => handleCookieConsent(true)}
                  className="flex-1 px-4 py-3 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Check size={18} />
                  Accept
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                You can change your preference anytime in settings
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PomoConsentBanner;