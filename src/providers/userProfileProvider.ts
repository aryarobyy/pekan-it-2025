import { USER_PROFILE_EP } from "@/core/endpoints";
import axiosInstance from "./axiosInstance";
import type { PostUserProfileType } from "@/types/userProfileType";

export const addUserProfile = async (userId: number,data: PostUserProfileType) => {
  try {
    const res = await axiosInstance.post(`${USER_PROFILE_EP}/${userId}`, data);
    console.log("Data UserProfile: ", res);
    return res.data.data;
  } catch (e) {
    console.error(e, "Error in addUserProfile API");
    throw e;
  }
};

export const getUserProfile = async (userId: number) => {
  try {
    const res = await axiosInstance.get(`${USER_PROFILE_EP}/${userId}`);
    console.log("Data profile: ", res);
    return res.data.data;
  } catch (e) {
    console.error(e, "Error in get id API");
    throw e;
  }
};

export const deleteUserProfile = async (id: number) => {
  try {
    const res = await axiosInstance.get(`${USER_PROFILE_EP}/${id}`);
    console.log("Data: ", res);
    return res.data.data;
  } catch (e) {
    console.error(e, "Error in delete id API");
    throw e;
  }
};