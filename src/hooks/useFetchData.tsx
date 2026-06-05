import _ from "lodash";
import axiosInstanceDefault from "../providers/axiosInstance";
import { AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios";
import { useEffect, useState, useRef } from "react";
import type { ApiError } from "../types/apiType";
import { isRequestSuccessful, sanitizeData } from "../helpers/apiHelpers";

type FetchOptions<T> = {
  url: string;
  initialData?: T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: any;
  initialCall?: boolean;
  callbackFun?: (data: T) => void;
  axiosInstance?: AxiosInstance;
};

export function useFetchData<T>({
  url,
  initialData,
  params,
  initialCall,
  callbackFun,
  axiosInstance,
}: FetchOptions<T>) {
  if (initialCall === undefined) {
    initialCall = true;
  }
  let axios = axiosInstanceDefault;
  if (axiosInstance) {
    axios = axiosInstance;
  }
  const [initialUrl, setInitialUrl] = useState<string>(url);
  const [allowApiCall, setAllowApiCall] = useState<boolean>(initialCall);
  const [loading, setLoading] = useState<boolean>(initialCall);
  const [apiData, setData] = useState<T>(initialData ? initialData : ([] as T));
  const [queryParams, updateQueryParams] = useState<object>(params);
  const resStateRef = useRef<boolean>(false);
  const didCancelRef = useRef<boolean>(false);

  const updateInitialUrl = (
    value: string,
    withLoading: boolean = false,
    queryParams: object
  ) => {
    if (withLoading) {
      setLoading(true);
    }
    setInitialUrl(value);
    updateQueryParams((prevQueryParams) => ({
      ...prevQueryParams,
      ...queryParams,
    }));
    setAllowApiCall(true);
  };

  const reCallAPI = () => {
    setQueryParams(queryParams);
  };

  const setQueryParams = (queryParams: object) => {
    setLoading(true);
    updateQueryParams((prevQueryParams) => ({
      ...prevQueryParams,
      ...queryParams,
    }));
    setAllowApiCall(true);
  };

  useEffect(() => {
    didCancelRef.current = false;
    const fetchData = () => {
      resStateRef.current = true;
      let params = {};
      if (!_.isEmpty(queryParams)) {
        params = {
          ...trimObjectValues(queryParams),
        };
      }
      axios
        .get(initialUrl, { params: sanitizeData(params) })
        .then((data: AxiosResponse) => {
          resStateRef.current = false;
          if (!didCancelRef.current) {
            // setAllowApiCall(false)
            if (isRequestSuccessful(data.status)) {
              setLoading(false);
              setData(data.data);
              if (callbackFun) callbackFun(data.data);
            } else {
              setLoading(false);

              setData(initialData ? initialData : ({} as T));
              if (callbackFun) callbackFun(data.data);
            }
          }
        })
        .catch((error: ApiError) => {
          console.error(error);
          if (error.response?.data?.message) {
            if (callbackFun) callbackFun(error.response.data as T);
          } else {
            if (callbackFun) callbackFun(error as T);
          }
          setLoading(false);
        });
    };

    if (allowApiCall && !resStateRef.current) fetchData();
    return () => {
      didCancelRef.current = true;
    };
  }, [initialUrl, queryParams, allowApiCall]);

  return [
    {
      loading,
      apiData,
      initialUrl,
      queryParams,
    },
    {
      setData,
      setLoading,
      updateInitialUrl,
      setQueryParams,
      reCallAPI,
    },
  ] as const;
}

export const usePostData = <T,> (url: string, configs?: AxiosRequestConfig, axiosInstance?: AxiosInstance) => {
  const [endpointApi, setEndpointApi] = useState<string>(url);
  const [response, setResponse] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [axiosConfig, setAxiosConfig] = useState<AxiosRequestConfig | undefined>(configs);
  let axios = axiosInstanceDefault;
  if (axiosInstance) {
    axios = axiosInstance;
  }

  const postData = async (data: FormData | object, resourcId?: string | number):Promise <T> => {
    setLoading(true);
    try {
      const endpoint = resourcId ? `${endpointApi}/${resourcId}` : endpointApi;
      const response = await axios.post<T>(endpoint,
        data,
        axiosConfig
      );
      setResponse(response.data);

      return response.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error(err.response?.data);
        setError(err.response?.data.message);
        throw new Error(err.response?.data.message);
      } else if (err instanceof Error) {
        console.error(err.message);
        setError(err.message);
        throw new Error(err.message);
      } else {
        console.error("An unknown error occurred");
        setError("An unknown error occurred");
        throw new Error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return { response, error, loading, postData, updateRequestConfig: setAxiosConfig };
}

export const usePutData = <T,>(url: string, configs?: AxiosRequestConfig, axiosInstance?: AxiosInstance) => {
  const [response, setResponse] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [axiosConfig, setAxiosConfig] = useState<AxiosRequestConfig | undefined>(configs);
  let axios = axiosInstanceDefault;
  if (axiosInstance) {
    axios = axiosInstance;
  }
  const putData = async (data: FormData | T, newUrl?: string) => {
    setLoading(true);

    try {
      const response = await axios.put<T>(newUrl || url, data, axiosConfig);
      setResponse(response.data);

      return response.data;

    } catch (err) {
      if (err instanceof AxiosError) {
        console.error(err.response?.data);
        setError(err.response?.data.message);
        throw new Error(err.response?.data.message);
      } else if (err instanceof Error) {
        console.error(err.message);
        setError(err.message);
        throw new Error(err.message);
      } else {
        console.error("An unknown error occurred");
        setError("An unknown error occurred");
        throw new Error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return { response, error, loading, putData, updateRequestConfig: setAxiosConfig };
}

export const useDeleteData = <T,>(url: string, axiosInstance?: AxiosInstance) => {
  const [response, setResponse] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  let axios = axiosInstanceDefault;
  if (axiosInstance) {
    axios = axiosInstance;
  }
  const deleteData = async (id: string | number) => {
    setLoading(true);

    try {
      const response = await axios.delete<T>(`${url}/${id}`);
      setResponse(response.data);

      return response.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error(err.response?.data);
        setError(err.response?.data.message);
        throw Error(err.response?.data.message);
      } else if (err instanceof Error) {
        console.error(err.message);
        setError(err.message);
        throw Error(err.message);
      } else {
        console.error("An unknown error occurred");
        setError("An unknown error occurred");
        throw Error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return { response, error, loading, deleteData };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const trimObjectValues = (obj: any) => {
  if (_.isEmpty(obj)) {
    return obj;
  }
  Object.keys(obj).forEach((key) => {
    if (obj[key] && typeof obj[key] === "string") {
      obj[key] = obj[key].trim();
    }
  });
  return obj;
};
