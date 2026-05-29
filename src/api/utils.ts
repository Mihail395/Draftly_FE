import axios from "axios";

// Extract the actual error message from an Axios error
export const getErrorMessage = (err: unknown, fallback: string): string => {
    if (axios.isAxiosError(err)) {
        const responseData = err.response?.data as { message?: string } | undefined;
        if (responseData?.message) {
            return responseData.message;
        }
    }
    if (err instanceof Error) {
        return err.message;
    }
    return fallback;
};