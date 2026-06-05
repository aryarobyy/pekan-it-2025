import { FRIEND_EP, USER_EP } from "@/core/endpoints.ts";
import type { FriendReqType, UpdateUserType, UserType } from "../types/user.ts";
import axiosInstance from "./axiosInstance.ts";

export const register = async (data: any) => {
  try {
    const res = await axiosInstance.post(`${USER_EP}/`, data);
    console.log("Data regis: ", res);
    return res.data.data;
  } catch (e) {
    console.error(e, "Error in registerUser API");
    throw e;
  }
};

export const login = async (data: any) => {
  try {
    const res = await axiosInstance.post(`${USER_EP}/login`, data);
    console.log("Data login: ", res);
    return res.data.data;
  } catch (e) {
    console.error(e, "Error in login API");
    throw e;
  }
};

export const getUserById = async (id: string) => {
  try {
    const res = await axiosInstance.get(`${USER_EP}/${id}`);
    console.log("Data : ", res);
    return res.data.data;
  } catch (e) {
    console.error(e, "Error in get id API");
    throw e;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const res = await axiosInstance.get(`${USER_EP}/${email}`);
    console.log("Data : ", res);
    return res.data.data;
  } catch (e) {
    console.error(e, "Error in get email API");
    throw e;
  }
};

export const deleteUser = async (id: string) => {
  try {
    const res = await axiosInstance.delete(`${USER_EP}/${id}`);
    console.log("Data : ", res);
    return res.data.data;
  } catch (e) {
    console.error(e, "Error in get email API");
    throw e;
  }
};

export const getUsers = async () :Promise<UserType[]> => {
  try {
    const res = await axiosInstance.get(`${USER_EP}/`);
    console.log("Data : ", res);
    return res.data.data;
  } catch (e) {
    console.error(e, "Error in get email API");
    throw e;
  }
};

export const verifyToken = async (token: any) => {
  try {
    const res = await axiosInstance.post(`${USER_EP}/verify-token`, { token });
    return res.data.data;
  } catch (e) {
    console.error(e, "Error in verify token API");
    throw e;
  }
};

export const updateUser = async (id: number, data: UpdateUserType) => {
    try {
        const formData = new FormData();
        
        if (data.username) formData.append('username', data.username);
        if (data.name) formData.append('name', data.name);
        if (data.email) formData.append('email', data.email);
        if (data.role) formData.append('role', data.role);
        if (data.avatar) {formData.append('avatar', data.avatar);}
        
        if (data.newAvatar && data.newAvatar instanceof File) {
            formData.append('newAvatar', data.newAvatar);
        }

        console.log("FormData entries:");
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        const res = await axiosInstance.put(`${USER_EP}/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        if (!res.data || !res.data.data) {
            console.error("Invalid response format from server");
        }
        console.log("Helooo",res.data.data)
        return res.data.data;
    } catch (e: any) {
        console.error("Error response:", e.response?.data);
        console.error("Error status:", e.response?.status);
        throw e;
    }
};

export const getUserByUsn = async (username: string) => {
  try {
    const res = await axiosInstance.get(`${USER_EP}/usn/${username}`);
    // console.log("Data : ", res);
    return res.data.data;
  } catch (e) {
    console.error(e, "Error in get username API");
    throw e;
  }
};


//FRIEND_EP SECTION

export const getFriends = async (id: number, status: string) => {
  try {
    const res = await axiosInstance.get(`${USER_EP}/${FRIEND_EP}/${id}`, {
      params: {status}
    });
    return res.data.data;
  } catch (e) {
    console.error(e, "Error in get username API");
    throw e;
  }
};

export const getFriend= async (identifier: any) => { //bisa pake username atau id
  const isNumber = !isNaN(identifier);  
  try {
    const res = await axiosInstance.get(`${USER_EP}/${FRIEND_EP}/${identifier}?byUsername=${isNumber}`);
    console.log("Data : ", res);
    return res.data.data;
  } catch (e) {
    console.error(e, "Error in get friend API");
    throw e;
  }
};

export const requestFriend = async (data:any) => {
  try {
    const res = await axiosInstance.post(`${USER_EP}/${FRIEND_EP}`, data);
    console.log("Data : ", res);
    return res.data.data;
  } catch (e) {
    console.error(e, "Error in request friend API");
    throw e;
  }
};

export const updateFriendStatus = async (data: Partial<FriendReqType>) => {
  try {
    const res = await axiosInstance.post(`${USER_EP}/${FRIEND_EP}/status`, data);
    console.log("Data : ", res);
    return res.data.data;
  } catch (e: any) {
    console.error(e, "Error in update friend API");
    console.error(`Message error ${e.Message}`);
    throw e;
  }
};

export const deleteFriend = async (identifier: any) => {
  try {
    const res = await axiosInstance.delete(`${USER_EP}/${FRIEND_EP}/${identifier}`);
    console.log("Data : ", res);
    return res.data.data;
  } catch (e) {
    console.error(e, "Error in delete API");
    throw e;
  }
};