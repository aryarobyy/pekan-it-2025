import { useEffect, useCallback } from 'react';
import { addUserProfile } from '@/providers/userProfileProvider';
import type { PostUserProfileType } from '@/types/userProfileType';

export const useLocationConsent = (
  userId: number,
  showCookieConsent: boolean,
  cookieConsentGiven: boolean,
  handleCookieConsent: (accepted: boolean) => void
) => {
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      console.error("Browser tidak mendukung geolokasi.");
      handleCookieConsent(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const data: PostUserProfileType = await addUserProfile(userId, {
            userId,
            isLocationShared: true,
            latitude,
            longitude,
          });

          console.log("Location saved:", data);
          handleCookieConsent(true);
        } catch (error) {
          console.error("Gagal menyimpan lokasi:", error);

          if ((error as any)?.code === 1) {
            alert("Anda telah menolak izin lokasi. Silakan aktifkan kembali melalui pengaturan browser.");
          }

          handleCookieConsent(false);
        }
      },
      (error) => {
        console.error("Gagal mendapatkan lokasi:", error);
        handleCookieConsent(false);
      }
    );
  }, [userId, handleCookieConsent]);

  useEffect(() => {
    if (showCookieConsent && !cookieConsentGiven) {
      requestLocation();
    }
  }, [showCookieConsent, cookieConsentGiven, requestLocation]);

  return { requestLocation };
};
