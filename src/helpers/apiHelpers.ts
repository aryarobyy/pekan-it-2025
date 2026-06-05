/* eslint-disable @typescript-eslint/no-explicit-any */

import sanitizeHtml from "sanitize-html"
import dayjs from "dayjs"

export const sanitizeContent = (content: any) => {
	if (typeof content === "string") {
		return sanitizeHtml(content)
	}

	return content
}

const sanitizeArrayObject = (arrayOrObject: any) => {
	const output = Array.isArray(arrayOrObject) ? [] : {}

	// loop for an array
	for (const key in arrayOrObject) {
		const item = arrayOrObject[key]
		if (typeof item === "object" && item instanceof FormData) {
			// @ts-ignore
			output[key] = item
		} else if (
			typeof item === "object" &&
			item !== null &&
			dayjs.isDayjs(item)
		) {
			// @ts-ignore
			output[key] = item
		} else if (
			typeof item === "object" &&
			item !== null &&
			typeof item.getMonth === "function"
		) {
			// @ts-ignore
			output[key] = item
		} else if (
			Array.isArray(item) ||
			(typeof item === "object" && item !== null)
		) {
			// @ts-ignore
			output[key] = sanitizeArrayObject(item)
		} else {
			// @ts-ignore
			output[key] = sanitizeContent(item)
		}
	}

	return output
}

export const sanitizeData = (inputVal: any, prefixPropery?: string) => {
	try {
		if (typeof inputVal === "object" && inputVal instanceof FormData) {
			return inputVal
		}

		if (Array.isArray(inputVal) && prefixPropery && inputVal !== null) {
			const queryString = (inputVal as string[])
				.map((item) => `${prefixPropery}=${item}`)
				.join("&")
			return `?${queryString}`
		}
		if (
			Array.isArray(inputVal) ||
			(typeof inputVal === "object" && inputVal !== null)
		) {
			return sanitizeArrayObject(inputVal)
		}

		return sanitizeContent(inputVal)
	} catch (e) {
		console.log("parse error", e)
	}
}

export const isRequestSuccessful = (code: number) => {
	return code >= 200 && code <= 204
}

export const isEmptyObject = (obj = {}) => {
	for (const key in obj) {
		// eslint-disable-next-line no-prototype-builtins
		if (obj?.hasOwnProperty(key)) {
			return false
		}
	}
	return true
}
