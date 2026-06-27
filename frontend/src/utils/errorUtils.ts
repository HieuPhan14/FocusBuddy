import { AxiosError } from "axios";

const getErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
        const detail = error.response?.data?.detail
        if (Array.isArray(detail)) {
            return detail.map((dict: {msg: string}) => dict.msg).join("\n")
        }
        return detail ?? "Something went wrong"
    } else if (error instanceof Error) {
        return error.message
    } else {
        return "Something went wrong"
    }
}

export default getErrorMessage;