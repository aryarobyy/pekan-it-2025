export type ResponseApiType<T> = {
    code: number;
    statusMessage: string;
    data: T;
}

export type ApiError = {
    status: number;
    response: {
        data: {
            message: string
            errors: string[]
        }
    }
    message?: string
}

export type ResponseApiErrorType = {
    code: number;
    statusMessage: string;
    error: string;
    message: string
}