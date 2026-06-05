import React, { useState, useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";
import pomodoroBg from "../../assets/images/pomodor.png";
import type { UserType } from "../../types/user";
import { usePomoCookie } from "../../hooks/usePomoCookie";
import type { TimerType } from "@/types/pomodoroType";

interface PomodoroProps {
  user: UserType | null;
}

const PomodoroPage: React.FC<PomodoroProps> = ({ user }) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<TimerType>({
    minutes: 25,
    seconds: 0,
    isActive: false,
    isBreak: false,
    cycle: 1,
  });

  const { cookieConsentGiven, saveTimerState, loadTimerState } = usePomoCookie();

  const [timer, setTimer] = useState<TimerType>(timerRef.current);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    timerRef.current = timer;
  }, [timer]);

  useEffect(() => {
    if (!user || !cookieConsentGiven) {
      setIsInitialized(true);
      return;
    }
    
    const savedData = loadTimerState(user.id);
    if (savedData) {
      const updatedTimer = {
        minutes: savedData.minutes,
        seconds: savedData.seconds,
        isActive: false,
        isBreak: savedData.isBreak,
        cycle: savedData.cycle,
      };
      
      setTimer(updatedTimer);
      timerRef.current = updatedTimer;
      
      console.log("Ui timer:", {
        wasActive: updatedTimer.isActive,
        time: `${updatedTimer.minutes}:${updatedTimer.seconds.toString().padStart(2, '0')}`,
        cycle: updatedTimer.cycle,
        isBreak: updatedTimer.isBreak
      });

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    setIsInitialized(true);
  }, [user, cookieConsentGiven, loadTimerState]);

  useEffect(() => {
    if (!timer.isActive && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [timer.isActive]);

  useEffect(() => {
    if (!isInitialized || !timer.isActive) return;

    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (!prev.isActive) return prev;
        
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else {
          audioRef.current?.play?.();
          
          const newIsBreak = !prev.isBreak;
          const newCycle = newIsBreak ? prev.cycle : prev.cycle + 1;
          const newMinutes = newIsBreak
            ? newCycle % 4 === 0 ? 15 : 5
            : 25;

          const nextTimer = {
            minutes: newMinutes,
            seconds: 0,
            isActive: false,
            isBreak: newIsBreak,
            cycle: newCycle,
          };
          
          if (user?.id) {
            saveTimerState(nextTimer, user.id);
          }
          timerRef.current = nextTimer;
          return nextTimer;
        }
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isInitialized, timer.isActive, user, saveTimerState]);

  useEffect(() => {
    if (!timer.isActive || !user || !cookieConsentGiven) return;

    const saveInterval = setInterval(() => {
      saveTimerState(timerRef.current, user.id);
    }, 5000);

    return () => {
      clearInterval(saveInterval);
    };
  }, [timer.isActive, user, cookieConsentGiven, saveTimerState]);

  useEffect(() => {
    if (!user || !cookieConsentGiven) return;

    const handleBeforeUnload = () => {
      const stoppedTimer = {
        ...timerRef.current,
        isActive: false
      };
      saveTimerState(stoppedTimer, user.id);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && timerRef.current.isActive) {
        const stoppedTimer = {
          ...timerRef.current,
          isActive: false
        };
        setTimer(stoppedTimer);
        timerRef.current = stoppedTimer;
        saveTimerState(stoppedTimer, user.id);
        
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      handleBeforeUnload();
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user, cookieConsentGiven, saveTimerState]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (user?.id) {
        const stoppedTimer = {
          ...timerRef.current,
          isActive: false
        };
        saveTimerState(stoppedTimer, user.id);
      }
    };
  }, [user, saveTimerState]);

  useEffect(() => {
    const createBeepSound = () => {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 800;
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
      } catch (error) {
        console.error("Error creating beep sound:", error);
      }
    };

    audioRef.current = { play: createBeepSound } as any;
  }, []);

  const toggleTimer = () => {
    setTimer((prev) => {
      const newTimer = { ...prev, isActive: !prev.isActive };
      if (user?.id) {
        saveTimerState(newTimer, user.id);
      }
      return newTimer;
    });
  };

  const resetTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    const reset = {
      minutes: 25,
      seconds: 0,
      isActive: false,
      isBreak: false,
      cycle: 1,
    };
    
    setTimer(reset);
    timerRef.current = reset;
    
    if (user?.id) {
      saveTimerState(reset, user.id);
    }
  };

  const formatedTime = (m: number, s: number) =>
    `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;

  const totalSec = timer.minutes * 60 + timer.seconds;
  const maxSec = timer.isBreak
    ? (timer.cycle % 4 === 0 ? 15 : 5) * 60
    : 25 * 60;
  const progress = ((maxSec - totalSec) / maxSec) * 100;

  return (
    <div className="min-h-screen flex flex-col md:flex-row justify-center items-center p-4 relative">
      <div className="flex flex-col items-center mr-0 md:mr-16 mb-10 md:mb-0">
        <div className="text-center mb-8">
          <span className="font-medium">
            {timer.isBreak
              ? timer.isActive
                ? "Break?"
                : "It's Break Time"
              : timer.isActive
              ? "Time For Focus!"
              : "Let's Start?"}
          </span>
        </div>

        <div className="relative mb-8">
          <div className="w-64 h-64 mx-auto relative">
            <div
              className={`absolute inset-2 rounded-full bg-cover bg-center ${
                !timer.isBreak ? "bg-[#F3D67D]" : "bg-[#A9C9FF]"
              }`}
              style={{ backgroundImage: `url(${pomodoroBg})` }}
            ></div>

            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="5"
                fill="rgba(0, 0, 0, 0.2)"
                className="text-gray-200"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="5"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                className={!timer.isBreak ? "text-[#F3D67D]" : "text-[#A9C9FF]"}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1s ease" }}
              />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-mono font-bold text-white">
                  {formatedTime(timer.minutes, timer.seconds)}
                </div>
                <div className="text-sm text-gray-200 mt-2">
                  Cycle {timer.cycle}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={toggleTimer}
            className={`flex items-center gap-2 px-15 py-3 rounded-full font-medium transition-all transform hover:scale-105 ${
              !timer.isBreak
                ? "bg-secondary hover:bg-[#C19D33] text-white shadow-lg"
                : "bg-primary hover:bg-[#2A4269] text-white shadow-lg"
            }`}
          >
            {timer.isActive ? <Pause size={20} /> : <Play size={20} />}
            {timer.isActive ? "Pause" : "Start"}
          </button>

          <button
            onClick={resetTimer}
            className="px-6 py-3 rounded-full font-medium transition-all transform hover:scale-105 bg-gray-600 hover:bg-gray-700 text-white shadow-lg"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <div className="text-lg font-semibold text-white mb-2">
          Time for today
        </div>

        <div className="bg-[rgba(217,217,217,0.2)] rounded-xl shadow-md w-[24rem] h-[4.5rem] flex items-center overflow-hidden">
          <div className="w-2 h-full bg-[#F3C969] rounded-l-xl" />
          <div className="flex justify-between items-center w-full px-4 py-3">
            <span className="text-base text-white font-medium">Pomodoro</span>
            <span className="text-2xl font-bold text-white">25:00</span>
          </div>
        </div>

        <div className="bg-[rgba(217,217,217,0.2)] rounded-xl shadow-md w-[24rem] h-[4.5rem] flex items-center overflow-hidden">
          <div className="w-2 h-full bg-[#5873A1] rounded-l-xl" />
          <div className="flex justify-between items-center w-full px-4 py-3">
            <span className="text-base text-white font-medium">Short Break</span>
            <span className="text-2xl font-bold text-white">05:00</span>
          </div>
        </div>

        <div className="bg-[rgba(217,217,217,0.2)] rounded-xl shadow-md w-[24rem] h-[4.5rem] flex items-center overflow-hidden">
          <div className="w-2 h-full bg-[#1D2C4D] rounded-l-xl" />
          <div className="flex justify-between items-center w-full px-4 py-3">
            <span className="text-base text-white font-medium">Long Break</span>
            <span className="text-2xl font-bold text-white">15:00</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroPage;