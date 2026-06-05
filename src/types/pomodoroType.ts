export interface PomodoroType {
  id?: number;
  userId: number;
  duration: number;
  session: number;
  isDone?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PostPomodoroType {
  id? :number
  userId: number;
  duration: number;
  session: number;
  remainingTime: Number;
  isDone?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TimerType {
  minutes: number;
  seconds: number;
  isActive: boolean;
  isBreak: boolean;
  cycle: number;
}