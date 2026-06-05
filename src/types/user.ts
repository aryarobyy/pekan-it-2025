export interface UserType {
  id: number;
  username: string;
  email: string;
  name: string;
  avatar: string | null;
  role: "admin" | "user";
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateUserType {
  id?: number;
  username: string;
  email: string;
  name: string;
  avatar: string | null;
  role: "admin" | "user";
  newAvatar?: File;
  createdAt?: string;
  updatedAt?: string;
}

export interface PostUserType {
  username: string;
  email: string;
  password: string;
  name: string;
  avatar: string | null;
  role: "admin" | "user";
}

export interface LoginUserType {
  email: string;
  password: string;
}

export interface FriendReqType {
  id: number;
  requesterId: number;
  receiverId: number;
  status: FriendStatus;
  createdAt: string;
  updatedAt: string
}

export const FriendStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  BLOCKED: "BLOCKED",
  REJECTED: "REJECTED",
} as const;

export type FriendStatus = keyof typeof FriendStatus;

export interface FriendType {
  id: number;
  username: string;
  name: string;
  avatar: string;
  status: FriendStatus
}