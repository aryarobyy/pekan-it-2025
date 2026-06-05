import { TODO_EP } from "@/core/endpoints";
import type { PostTodoType, UpdateTodoType } from "../types/todo";
import axiosInstance from "./axiosInstance";

export const addTodo = async (data: PostTodoType) => {
  try {
    const res = await axiosInstance.post(`${TODO_EP}/`, data);
    console.log("Data todo: ", res);
    return res.data.data;
  } catch (e) {
    console.error(e, "Error in post todo API");
    throw e;
  }
};

export const getTodoById = async (id: string) => {
  try {
    const res = await axiosInstance.get(`${TODO_EP}/user/${id}`);
    return res.data.data;
  } catch (e) {
    console.error(e, "Error in get id API");
    throw e;
  }
};

export const getTodoByUser = async (id: number) => {
  try {
    const res = await axiosInstance.get(`${TODO_EP}/user/${id}`);
    return res.data.data;
  } catch (e) {
    console.error(e, "Error in get user todo API");
    throw e;
  }
};

export const deleteTodo = async (id: string) => {
  try {
    const res = await axiosInstance.delete(`${TODO_EP}/${id}`);
    console.log("Data : ", res);
    return res.data.data;
  } catch (e) {
    console.error(e, "Error in get email API");
    throw e;
  }
};

export const getTodos = async () => {
  try {
    const res = await axiosInstance.get(`${TODO_EP}/`);
    console.log("Data : ", res);
    return res.data.data;
  } catch (e) {
    console.error(e, "Error in get email API");
    throw e;
  }
};

export const updateTodo = async (id: number, data: UpdateTodoType) => {
  try {
    const res = await axiosInstance.put(`${TODO_EP}/${id}`, data);
    return res.data.data;
  } catch (e) {
    console.error(e, "Error in update API");
    throw e;
  }
};