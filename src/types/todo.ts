import type { UserType } from "./user";

export interface TodoType {
  id: number;
  userId: number;
  title: string;
  description: string;
  status: TodoStatus;
  priority: number;
  icon: string;
  deadline: string;
  color: Color;
  isChecked: boolean
  
  users: UserType[];
}

export interface PostTodoType {
  userId: number;
  priority: number;
  title: string;
  description: string;
  status: TodoStatus;
  deadline: string;
  color: Color;
  isChecked: boolean

  // users: UserType[]
}

export interface UpdateTodoType{
  id: number
  userId: number;
  title: string;
  description: string;
  status: TodoStatus;
  deadline: string;
  color: Color;
  isChecked: boolean;
  priority: number;
}

export const TodoStatus = {
  progress: "progress",
  completed: "completed",
  uncompleted: "uncompleted",
} as const;

export type TodoStatus = keyof typeof TodoStatus;

  export const Color = {
    cyan: "cyan",
    dark_blue: "dark_blue",
    yellow: "yellow",
    black: "black",
    sage: "sage",
  } as const;

export type Color = keyof typeof Color;