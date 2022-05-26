import Config from '../../Config.js'

import axios from 'axios'
import { Service } from '../../index.js';

const API = axios.create({
    withCredentials: true,
    crossDomain: true,
    baseURL: `${Config.SERVER_URL}/api`,
})

API.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    
    return config;
})

API.interceptors.response.use((config) => {
    return config;
}, async (error) => {
    const originalRequest = error.config;

    if (error?.response?.data?.error?.error_message === 'Access token expired' && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true;

        try {
            const response = await axios.post(`${Config.AUTH_URL}/refresh`, Config.DEV_REFRESH, { withCredentials: true, crossDomain: true })

            localStorage.setItem('token', response.data.response.access_token);
            
            return API.request(originalRequest);
        } catch (e) {
            Service.snackbar(e.response?.data?.error?.error_message || e.response?.data?.error?.error_description || 'Unknown error refreshing token')
            console.error(e.response?.data?.error || e)

            if (e.response?.data?.error?.error_message === 'Invalid token' || e.response?.data?.error?.error_message === 'Refresh token not defined') Service.logout()
        }
    } else {
        Service.snackbar(error.response?.data?.error?.error_message || error.response?.data?.error?.error_description || 'Unknown error refreshing token')
        console.error(error.response?.data?.error || error)
    }
})

export default API;