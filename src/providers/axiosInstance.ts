/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios";

export type ResErrorType = {
	status: number
	statusMessage: string
	message: string
	error: string
}

export type ResponseType<T> = {
	status: number
	statusMessage: string
	data: T
}

const onRequest = async (config: AxiosRequestConfig): Promise<any> => {
  //
  if (config.data instanceof FormData) {
    if (config.headers) {
      delete config.headers["Content-Type"];
    }
  }

  return config;
};


const onRequestError = (error: AxiosError): Promise<AxiosError> => {
	return Promise.reject(error)
}

const onResponse = async (
	response: AxiosResponse<ResponseType<any>>
): Promise<AxiosResponse> => {
	// if (response.status !== 200) {
	// 	// unauthorized redirect to sign
	// }
	return response
}

const onResponseError = async (
	error: AxiosError<ResErrorType>
): Promise<any> => {

	if (error.response?.status === 404) {
		// Manipulasi respons agar tetap sukses
		return Promise.resolve({
			...error.response,
			status: error.response.status,
			statusMessage: error.response.data.statusMessage,
			message: error.response.data.message,
			error: error.response.data.error,
		})
	}
	return Promise.reject(error)
}

export function setupInterceptorsTo(
	axiosInstance: AxiosInstance
): AxiosInstance {
	axiosInstance.interceptors.request.use(onRequest, onRequestError)
	axiosInstance.interceptors.response.use(onResponse, onResponseError)
	return axiosInstance
}

const axiosInstance = setupInterceptorsTo(
	axios.create({
		baseURL: `${import.meta.env.VITE_BACKEND_URI}`,
		headers: {
			// "Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
			// "ngrok-skip-browser-warning": true,

			// temporary //
			// "Cache-Control": "no-cache"
		},
	})
)
export default axiosInstance