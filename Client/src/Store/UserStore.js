/* eslint-disable eqeqeq */
import Config from '../Config.js'

import axios from 'axios'
import { makeAutoObservable } from 'mobx'
import iziToast from 'izitoast'

import API from '../Controller/API.js'
import { GenerateToken } from '../Controller/Utils.js'

export default class Store {
    config = {
        MAIN_DOMAIN: 'http://localhost/',
    }
    user = {
        _id: String,
        name: String,
        space_limit: Number,
        space_used: Number,
    }
    fetchParams = {
        sort: 'name',
        sortOrder: 1,
        parent: 'undefined'
    }
    search = ''
    folder = null
    file = null
    data = [ ]
    uploading = { }

    isLoading = true
    isAuth = undefined

    constructor() {
        makeAutoObservable(this)

        if (Config?.MAIN_DOMAIN) this.config.MAIN_DOMAIN = Config?.MAIN_DOMAIN
    }

    setUser(user) {
        this.user = user

        if (!user?.space_used) this.user.space_used = 0
    }

    setParent(parent) {
        this.parent = parent
    }

    setData(data) {
        this.data = data
    }

    setFetchParams(params) {
        if (params.sort) this.fetchParams.sort = params.sort
        if (params.parent) this.fetchParams.parent = params.parent
    }

    setSearch(search) {
        this.search = search
    }

    setFolder(folder) {
        this.folder = folder
    }

    setFile(file) {
        this.file = file
    }

    setAuth(bool) {
        this.isAuth = bool
    }

    setLoading(bool) {
        this.isLoading = bool
    }

    async logout() { 
        return new Promise(async (resolve, reject) => {
            try {
                await axios.get(Config.AUTH_URL + '/api/auth/logout', {
                    withCredentials: true,
                    crossDomain: true,
                })

                localStorage.removeItem('token')

                this.setAuth(false)
                this.setUser({})

                resolve(true)
            } catch (e) {
                console.error(e.response?.data.error || e)
                reject(e.response?.data?.error || 'Unknown error')
            }
        })
    }

    async register(name, password) {
        return new Promise(async (resolve, reject) => {
            try {
                await axios.post(
                    Config.AUTH_URL + '/api/auth/register',
                    { name, password },
                    { withCredentials: true, crossDomain: true }
                )
                resolve(true)
            } catch (e) {
                reject(e.response?.data?.error || 'Unknown error')
            }
        })
    }

    async login(name, password) {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await axios.post(
                    Config.AUTH_URL + '/api/auth/login',
                    { name, password },
                    { withCredentials: true, crossDomain: true }
                )

                console.log(response.data.response)
                localStorage.setItem(
                    'token',
                    response?.data?.response?.access_token
                )

                resolve(true)
            } catch (e) {
                reject(e.response?.data?.error || 'Unknown error')
            }
        })
    }

    checkAuth() {
        return new Promise(async (resolve, reject) => {
            if (!localStorage.getItem('token')) {
                try {
                    const response = await axios.post(
                        `${Config.AUTH_URL}/api/auth/refresh`,
                        { withCredentials: true, crossDomain: true }
                    )

                    localStorage.setItem(
                        'token',
                        response.data.response.access_token
                    )

                    return this.checkAuth()
                } catch (e) {
                    console.error(e)
                    reject(e.response?.data || e)

                    this.setLoading(false)
                    this.setAuth(false)
                }
            } else {
                try {
                    const response = await API({
                        url: '/api/auth/user',
                        baseURL: Config.AUTH_URL,
                    })

                    this.setUser(response.data.response)
                    this.setAuth(true)

                    resolve(true)
                } catch (e) {
                    if (e.response?.data?.error?.error_code === 401)
                        this.logout()

                    reject(e.response?.data || e)
                } finally {
                    this.setLoading(false)
                }
            }
        })
    }

    async upload(file) {
        return new Promise(async (resolve, reject) => {
            if (!file || !file.name) return reject('File not defined')
            if (this.uploading[file.name] && this.uploading[file.name]?.status === 'uploading') return reject('This file already uploading')

            let ID = `${GenerateToken(10)}_${file.name}`

            try {
                let formData = new FormData()
                formData.append('file', file, encodeURIComponent(file.name))

                delete this.uploading[ID]

                let controller = new AbortController()
                this.uploading[ID] = {
                    id: ID,
                    status: 'uploading',
                    name: decodeURIComponent(file.name),
                    size: file.size,
                    type: file.type,
                    progress: 0,
                    controller
                }

                let response = await API({
                    signal: controller.signal,
                    method: 'POST',
                    baseURL: Config.UPLOADER_URL,
                    data: formData,
                    headers: { 'Content-Type': 'multipart/form-data' },
                    params: { parent: this.fetchParams.parent !== 'undefined' ? this.fetchParams.parent : undefined },
                    onUploadProgress: progress => this.uploading[ID].progress = Math.round((100 * progress.loaded) / progress.total)
                })

                this.uploading[ID].status = 'success'
                this.snackbar('File uploaded successfully', 'info', 'cloud_done')
                this.user.space_used = (this.user.space_used || 0) + response?.data?.response?.file?.size

                resolve(response?.data?.response)

                this.getData()

                setTimeout(() => this.uploading[ID].hide = true, 3000)
            } catch (e) {
                if (e.message == 'canceled') {
                    this.snackbar('File upload canceled', 'info', 'close')
                    this.uploading[ID].status = 'canceled'
                    return setTimeout(() => this.uploading[ID].hide = true, 3000)
                } 

                console.error(e)
                this.snackbar('File upload error', 'error', 'error')
                reject(e.response?.data?.error || 'Unknown error')
                
                if (this.uploading[ID]) this.uploading[ID].status = 'error'
            }
        })
    }

    cancelUpload(id) {
        this.uploading[id].controller.abort()
        this.uploading[id].status = 'canceled'
    }

    async createFolder(data) {
        return new Promise(async (resolve, reject) => {
            if (!data || !data.name) return reject('Folder file not defined')

            try {
                let response = await API.post('/cloud/create', { name: data.name, type: 'folder', parent: this.fetchParams.parent !== 'undefined' ? this.fetchParams.parent : undefined })

                this.snackbar('Folder created successfully', 'info', 'folder')

                resolve(response?.data?.response)

                this.getData()
            } catch (e) {
                console.error(e)
                this.snackbar('Folder create error', 'error', 'error')
                reject(e.response?.data?.error || 'Unknown error')
            }
        })
    }

    async delete(data) {
        return new Promise(async (resolve, reject) => {
            if (!data || !data._id) return reject('File not defined')

            try {
                let response = await API.post('/cloud/remove', { _id: data._id })

                this.snackbar('File deleted successfully', 'info', 'delete')

                resolve(response?.data?.response)
                this.user.space_used -= data.size

                this.getData()
            } catch (e) {
                console.error(e)
                this.snackbar('File delete error', 'error', 'error')
                reject(e.response?.data?.error || 'Unknown error')
            }
        })
    }

    getData(query = {}, isUpdateStore = true) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await API({ 
                    url: '/cloud/get', 
                    params: { 
                        _id: query._id,
                        parent: query.parent === null ? null : query.parent || this.fetchParams.parent || 'undefined', 
                        sort: query.sort || this.fetchParams.sort,
                        type: query.type, 
                        createdAtDay: query.createdAtDay, 
                    }
                })
    
                if (isUpdateStore === true) this.setData(response?.data?.response || [])
    
                resolve(response?.data?.response || [])
            } catch (e) {
                console.error(e)
                reject(e?.response?.data || e);
            }
        })
    }

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
            class: 'info',
        }

        if (type === 'error') {
            toastConfig.iconText = 'error'
            toastConfig.class = 'warning'
        } else if (type === 'warning') {
            toastConfig.iconText = 'warning'
            toastConfig.class = 'warning'
        }

        if (icon) toastConfig.iconText = icon

        iziToast.show(toastConfig)
    }
}
