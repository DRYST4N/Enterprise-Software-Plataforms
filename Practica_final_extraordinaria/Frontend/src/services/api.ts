import axios from 'axios';

export const publicAPI = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true,
});

export const adminAPI = axios.create({
    baseURL: 'http://localhost:4000/api',
    withCredentials: true,
});

export const paymentAPI = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
});

const injectTokenInterceptor = (config: any) => {
    const token = localStorage.getItem('castilla_rooms_token');
    if(token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config
};

const handleInterceptorError = (error: any) => {
    return Promise.reject(error);
};

publicAPI.interceptors.request.use(injectTokenInterceptor,handleInterceptorError);
adminAPI.interceptors.request.use(injectTokenInterceptor, handleInterceptorError);
paymentAPI.interceptors.request.use(injectTokenInterceptor, handleInterceptorError);

export default publicAPI;