/* eslint-disable eqeqeq */
import Config from '../Config.js'

import axios from 'axios'
import { makeAutoObservable } from 'mobx'

import API from '../Controller/API.js'

export default class Store {
    config = {
        MAIN_DOMAIN: 'http://localhost/'
    };
    user = {
        _id: String,
        name: String,
        space_limit: Number,
        space_used: Number
    };
    isLoading = true;
    isAuth = undefined;

    constructor() {
        makeAutoObservable(this);

        if (Config?.MAIN_DOMAIN) this.config.MAIN_DOMAIN = Config?.MAIN_DOMAIN;
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

    async logout() {
        try {
            await axios.get(Config.AUTH_URL + '/api/auth/logout', { withCredentials: true, crossDomain: true })

            localStorage.removeItem('token');

            this.setUser(null);
            this.setAuth(false);

            this.isOnline = true;
        } catch (e) {
            console.error(e.response?.data.error);
        }
    }

    checkAuth() {
        return new Promise(async (resolve, reject) => {
            if (!localStorage.getItem('token')) {
                try {
                    const response = await axios.post(`${Config.AUTH_URL}/api/auth/refresh`, { withCredentials: true, crossDomain: true })

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
                    const response = await API({ url: '/api/auth/user', baseURL: Config.AUTH_URL });

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
        })
    }
}
