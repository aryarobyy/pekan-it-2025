import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { verifyToken } from "../providers/userProvider";
import type { ApiError } from "../types/apiType";
import { useLocation } from "react-router";
import type { UpdateUserType, UserType as User } from "../types/user";
import { TOKEN } from "@/core/appData";

type UseGetUserReturn = {
  user: User | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  logout: (redirectToLogin?: boolean) => void;
}

let userCache: User | null = null;
let lastFetchTime: number | null = null;
let isCurrentlyFetching: boolean = false;

const CACHE_TIME: number = 10 * 60 * 1000; // 10 menit

const useGetUser = (): UseGetUserReturn  => {
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(userCache);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  const fetchUser = async (): Promise<void> => {
    const token: string | undefined = Cookies.get(TOKEN);
    
    if (!token) {
      userCache = null;
      lastFetchTime = null;
      setUser(null);
      setLoading(false);
      return;
    }

    const now: number = Date.now();
    const cacheIsValid: boolean = Boolean(
      userCache && 
      lastFetchTime && 
      (now - lastFetchTime) < CACHE_TIME
    );
    
    if (cacheIsValid) {
      setUser(userCache);
      setLoading(false);
      return;
    }

    if (isCurrentlyFetching) return;

    try {
      isCurrentlyFetching = true;
      setLoading(true);
      setError(null);

      const userData: UpdateUserType = await verifyToken(token);
      
      const transformedUser: User = {
        id: userData.id || 0,
        username: userData.username,
        email: userData.email,
        name: userData.name,
        avatar: userData.avatar || '',
        role: userData.role,
        createdAt: userData.createdAt || '',
        updatedAt: userData.updatedAt || ''
      };

      userCache = transformedUser;
      lastFetchTime = now;
      setUser(transformedUser);

    } catch (e: unknown) {
      const apiError = e as ApiError;
      setError(apiError.message || 'Ada yang error');
      setUser(null);

      if (apiError.status === 401 || apiError.status === 403) {
        logout(true);
      }
    } finally {
      setLoading(false);
      isCurrentlyFetching = false;
    }
  };

  const refetch = (): void => {
    userCache = null;
    lastFetchTime = null;
    fetchUser();
  };

  const logout = (redirectToLogin: boolean = true): void => {
    Cookies.remove(TOKEN);

    userCache = null;
    lastFetchTime = null;
    setUser(null);
    setError(null);

    if (redirectToLogin && typeof window !== 'undefined') {
      location.pathname = '/login';
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { 
    user, 
    loading, 
    error, 
    refetch, 
    logout,
  };
};

export default useGetUser;