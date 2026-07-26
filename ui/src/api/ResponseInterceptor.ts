import type {
    AxiosError,
    AxiosInstance,
    AxiosResponse,
} from "axios";

export default function configureResponseInterceptor(
    api: AxiosInstance,
) {

    api.interceptors.response.use(
        (response: AxiosResponse) => response,

        async (error: AxiosError) => {

            if (error.response?.status === 401) {
                console.log("Unauthorized");
            }

            return Promise.reject(error);
        },
    );
}