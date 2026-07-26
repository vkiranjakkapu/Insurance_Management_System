import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import TokenStorage from "../storage/TokenStorage";


export default function configureRequestInterceptor(api: AxiosInstance) {
    api.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {

            const accessToken = TokenStorage.getAccessToken();

            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }

            return config;
        },
        (error) => Promise.reject(error),
    );
}