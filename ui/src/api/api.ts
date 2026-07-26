import axios from "axios";
import configureRequestInterceptor from "./RequestInterceptor";
import configureResponseInterceptor from "./ResponseInterceptor";
import { AppConfig } from "../config/AppConfig";

const api = axios.create({
    baseURL: AppConfig.API_BASE_URL,
    timeout: 5000,
});

configureRequestInterceptor(api);
configureResponseInterceptor(api);

export default api;
