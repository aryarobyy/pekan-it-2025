import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import type { PostPomodoroType, TimerType } from "../types/pomodoroType";
import { postPomodoro } from "../providers/pomodoroProvider";
import { POMODORO_COOKIE_CONSENT, POMODORO_COOKIE_KEY } from "@/core/appData";

interface PomodoroSaveState {
  userId: number;
  workDuration: number;
  breakDuration: number;
  workSessions: number;
  breakSessions: number;
  timestamp: number;
  wasActive: boolean;

  minutes: number;
  seconds: number;
  isBreak: boolean;
  cycle: number;
}

interface UsePomoCookieReturn {
  showCookieConsent: boolean;
  cookieConsentGiven: boolean;
  handleCookieConsent: (accepted: boolean) => void;
  saveTimerState: (data: TimerType, userId: number | undefined) => void;
  loadTimerState: (userId: number | undefined) => PomodoroSaveState | null;
}

export const usePomoCookie = (): UsePomoCookieReturn => {
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [cookieConsentGiven, setCookieConsentGiven] = useState(false);

  useEffect(() => {
    const consent = Cookies.get(POMODORO_COOKIE_CONSENT);
    if (consent === "accepted") {
      setCookieConsentGiven(true);
    } else if (!consent) {
      setShowCookieConsent(true);
    }
  }, []);

  const handleCookieConsent = useCallback((accepted: boolean) => {
    if (accepted) {
      Cookies.set(POMODORO_COOKIE_CONSENT, "accepted", {
        expires: 365,
        secure: true,
        sameSite: "Lax",
      });
      setCookieConsentGiven(true);
    } else {
      Cookies.set(POMODORO_COOKIE_CONSENT, "declined", {
        expires: 365,
        secure: true,
        sameSite: "Lax",
      });
      setCookieConsentGiven(false);
    }
    setShowCookieConsent(false);
  }, []);

  const saveTimerState = useCallback(
    async (timerData: TimerType, userId: number | undefined) => {
      if (!cookieConsentGiven || userId === undefined) return;

      try {
        const stored =
          Cookies.get(POMODORO_COOKIE_KEY) ||
          localStorage.getItem(POMODORO_COOKIE_KEY) ||
          sessionStorage.getItem(POMODORO_COOKIE_KEY);

        let prevData: PomodoroSaveState = {
          userId,
          workDuration: 0,
          breakDuration: 0,
          workSessions: 0,
          breakSessions: 0,
          timestamp: Date.now(),
          wasActive: false,
          minutes: timerData.minutes,
          seconds: timerData.seconds,
          isBreak: timerData.isBreak,
          cycle: timerData.cycle,
        };

        if (stored) {
          const parsed = JSON.parse(stored) as PomodoroSaveState;
          prevData = {
            ...parsed,
            minutes: timerData.minutes,
            seconds: timerData.seconds,
            isBreak: timerData.isBreak,
            cycle: timerData.cycle,
            timestamp: Date.now(),
            wasActive: false,
          };

          if (!timerData.isActive) {
            const sessionDuration = timerData.isBreak
              ? (timerData.cycle % 4 === 0 ? 15 : 5) * 60
              : 25 * 60;
            
            const remainingTime = timerData.minutes * 60 + timerData.seconds;
            const completedTime = sessionDuration - remainingTime;

            if (completedTime > 0) {
              if (timerData.isBreak) {
                prevData.breakDuration += completedTime;
                if (completedTime >= sessionDuration * 0.8) {
                  prevData.breakSessions += 1;
                }
              } else {
                prevData.workDuration += completedTime;
                if (completedTime >= sessionDuration * 0.8) {
                  prevData.workSessions += 1;
                }
              }
            }
          }
        }

        const jsonData = JSON.stringify(prevData);
        
        try {
          Cookies.set(POMODORO_COOKIE_KEY, jsonData, {
            expires: 1,
            path: "/",
            secure: window.location.protocol === 'https:',
            sameSite: "lax",
          });
        } catch (cookieError) {
          console.log("Cannot save to cookies:", cookieError);
        }

        try {
          localStorage.setItem(POMODORO_COOKIE_KEY, jsonData);
        } catch (localStorageError) {
          console.log("Cannot save to localStorage:", localStorageError);
        }

        try {
          sessionStorage.setItem(POMODORO_COOKIE_KEY, jsonData);
        } catch (sessionStorageError) {
          console.log("Cannot save to sessionStorage:", sessionStorageError);
        }

        console.log("Pomodoro session saved:", {
          ...prevData,
          savedAsActive: false,
          currentTime: `${timerData.minutes}:${timerData.seconds.toString().padStart(2, '0')}`
        });

        if (prevData.workSessions >= 4 && prevData.breakSessions >= 3) {
          const totalDuration = prevData.workDuration + prevData.breakDuration;

          const dataToPost: PostPomodoroType = {
            userId,
            remainingTime: timerData.minutes * 60 + timerData.seconds,
            duration: totalDuration,
            session: prevData.workSessions,
            isDone: true,
          };

          console.log("Sending to DB:", dataToPost);
          
          try {
            await postPomodoro(dataToPost);
            
            Cookies.remove(POMODORO_COOKIE_KEY);
            localStorage.removeItem(POMODORO_COOKIE_KEY);
            sessionStorage.removeItem(POMODORO_COOKIE_KEY);
            
            console.log("Cleared storage after sync.");
          } catch (error) {
            console.error("Error syncing to database:", error);
          }
        }
      } catch (error) {
        console.error("Error saving pomodoro data:", error);
      }
    },
    [cookieConsentGiven]
  );

  const loadTimerState = useCallback(
    (userId: number | undefined): PomodoroSaveState | null => {
      if (!cookieConsentGiven || userId === undefined) return null;

      try {
        let data = null;
        
        try {
          data = Cookies.get(POMODORO_COOKIE_KEY);
        } catch (error) {
          console.log("Cannot read from cookies:", error);
        }

        if (!data) {
          try {
            data = localStorage.getItem(POMODORO_COOKIE_KEY);
          } catch (error) {
            console.log("Cannot read from localStorage:", error);
          }
        }

        if (!data) {
          try {
            data = sessionStorage.getItem(POMODORO_COOKIE_KEY);
          } catch (error) {
            console.log("Cannot read from sessionStorage:", error);
          }
        }

        if (!data) return null;

        const parsedData: PomodoroSaveState = JSON.parse(data);
        if (parsedData.userId === userId) {
          const safeData = {
            ...parsedData,
            wasActive: false
          };
          
          console.log("Timer di cookie:", {
            wasActive: false,
            time: `${parsedData.minutes}:${parsedData.seconds.toString().padStart(2, '0')}`,
            cycle: parsedData.cycle,
            isBreak: parsedData.isBreak
          });
          return safeData;
        }
        return null;
      } catch (error) {
        console.error("Error loading pomodoro data from storage:", error);
        return null;
      }
    },
    [cookieConsentGiven]
  );

  return {
    showCookieConsent,
    cookieConsentGiven,
    handleCookieConsent,
    saveTimerState,
    loadTimerState,
  };
};