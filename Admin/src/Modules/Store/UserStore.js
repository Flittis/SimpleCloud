/* eslint-disable eqeqeq */
import Config from '../../Config.js'

import { makeAutoObservable } from 'mobx'
import iziToast from 'izitoast'
import axios from 'axios'

import API from '../Controller/API.js'

export default class Store {
    error = {
        status: false,
        message: String,
        icon: String,
        button: {
            show: false,
            label: String,
            link: String
        }
    };

    config = {
        MAIN_DOMAIN: 'http://localhost/',
        ACCESS: undefined
    };
    user = {};
    isAuth = undefined;
    isLoading = true;

    constructor() {
        makeAutoObservable(this);

        if (Config?.MAIN_DOMAIN) this.config.MAIN_DOMAIN = Config?.MAIN_DOMAIN;
        if (Config?.ACCESS) this.config.ACCESS = Config?.ACCESS;
    }

    setUser(user) {
        this.user = user;
    }

    setAuth(bool) {
        this.isAuth = bool;
    }

    setLoading(bool) {
        this.isLoading = bool;
    }
    
    setError(err, icon, status, button) {
        this.error.status = status || true;
        this.error.message = err;

        if(icon) this.error.icon = icon;
        if(button) this.error.button = button === true ? { show: true } : button;
    }

    async logout() {
        try {
            await axios.get(Config.AUTH_URL + '/logout', { withCredentials: true, crossDomain: true })

            localStorage.removeItem('token');

            this.setUser(null);
            this.setAuth(false);

            this.error.status = false;
            this.isOnline = true;
        } catch (e) {
            console.error(e.response?.data.error);
        }
    }

    checkAuth() { return new Promise(async (resolve, reject) => {
        if(!localStorage.getItem('token')) {
            try {
                const response = await axios.post(`${Config.AUTH_URL}/refresh`, Config.DEV_REFRESH, { withCredentials: true, crossDomain: true })

                localStorage.setItem('token', response.data.response.access_token)

                return this.checkAuth()
            } catch (e) {
                console.error(e)
                reject(e.response?.data || e);

                this.setLoading(false);
                this.setAuth(false);
            }
        } else {
            try {
                const response = await API({ url: '/user', baseURL: Config.AUTH_URL });

                this.setAuth(true);
                this.setUser(response.data.response);

                resolve(true);
            } catch (e) {
                if (e.response?.data?.error?.error_code === 401) this.logout();

                reject(e.response?.data || e);
            } finally {
                this.setLoading(false);
            }
        }
    })}

    snackbar(message, type = 'info', icon) {
        let toastConfig = {
            message: message,
            position: 'topCenter',
            theme: 'dark',
            close: true,
            animateInside: false,
            closeOnClick: true,
            icon: 'material-icons-round',
            iconText: 'info',
            timeout: 3000,
            progressBar: false,
            class: 'info'
        };

        if (type === 'error') {
            toastConfig.iconText = 'error';
            toastConfig.class = 'warning';
        } else if (type === 'warning') {
            toastConfig.iconText = 'warning';
            toastConfig.class = 'warning';
        }

        if (icon) toastConfig.iconText = icon;

        iziToast.show(toastConfig);
    }
}
