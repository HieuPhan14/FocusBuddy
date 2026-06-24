import { AxiosError } from "axios";

const getErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
        return error.response?.data?.detail ?? "Something went wrong"
    } else if (error instanceof Error) {
        return error.message
    } else {
        return "Something went wrong"
    }
}

export default getErrorMessage;