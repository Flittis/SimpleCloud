import Err from '../Service/ErrorService.js'

import mongoose from 'mongoose'

import { AccessToken, RefreshToken, User } from '../Model/UserModel.js'
import { UserData } from '../Class/UserClass.js'

let AuthController = {
    login: async (req, res, next) => {
        try {
            if (!req.query.name || !req.query.password) return next(new Err(400, 'Name or Password is not defined'))

            let SelfUser = await User.findOne({ name: req.query.name }).exec()

            if (!SelfUser || !SelfUser.checkPassword(req.query.password)) return next(new Err(401, 'Name or Password is invalid'))

            let _NewRefreshToken = new RefreshToken({ user: SelfUser._id, ip: req.headers['cf-connecting-ip'] || (req.ips ? req.ips[0] : null), country: req.headers['cf-ipcountry'], useragent: req.get('User-Agent') })
            let NewRefreshToken = await _NewRefreshToken.save()

            let _NewAccessToken = new AccessToken({ user: SelfUser._id, parent: NewRefreshToken._id })
            let NewAccessToken = await _NewAccessToken.save()

            res.cookie('refresh_token', NewRefreshToken.token, { secure: true, httpOnly: true, sameSite: false, maxAge: 8760 * 3600000 })
            res.cookie('user', SelfUser._id, { secure: true, httpOnly: true, sameSite: false, maxAge: 8760 * 3600000 })

            res.res({ user: new UserData(SelfUser), access_token: NewAccessToken.token, refresh_token: NewRefreshToken.token })
        } catch (e) {
            console.error(e)
            next(e)
        }
    },
    register: async (req, res, next) => {
        try {
            if (!req.query.name || !req.query.password) return next(new Err(400, 'Name or Password is not defined'))
            if (req.query.name.length < 5) return next(new Err(400, 'Name is too short'))
            if (!(/^[a-z0-9_-]+$/i).test(req.query.name)) return next(new Err(400, 'Name contains inappropriate characters'))
            if (req.query.password.length < 5) return next(new Err(400, 'Password is too short'))
            if (!(/^[a-z0-9_-]+$/i).test(req.query.password)) return next(new Err(400, 'Password contains inappropriate characters'))

            let isExist = await User.exists({ name: req.query.name })
            if (isExist?._id) return next(new Err(400, 'User with the same name already registered'))

            let _NewUser = new User({ name: req.query.name })
            _NewUser.setPassword(req.query.password)

            let NewUser = await _NewUser.save()

            res.res({ success: true, user: new UserData(NewUser) })
        } catch (e) {
            console.error(e)
            next(e)
        }
    },
    refresh: async (req, res, next) => {
        try {
            if (!req.query.refresh_token && !req.cookies.refresh_token) return next(new Err(400, 'Refresh token not defined'))
            if (!req.query.user && !req.cookies.user) return next(new Err(401, 'Invalid session'))

            let SelfToken = await RefreshToken.findOne({ token: req.query.refresh_token || req.cookies.refresh_token, user: req.query.user || req.cookies.user }).populate('user').exec()

            if (!SelfToken || SelfToken.status != 'active' || !SelfToken.user?._id) return next(new Err(401, 'Invalid session'))

            let _NewAccessToken = new AccessToken({ user: SelfToken.user, parent: SelfToken._id })
            let NewAccessToken = await _NewAccessToken.save()

            res.res({ access_token: NewAccessToken.token })
        } catch (e) {
            if (e instanceof mongoose.CastError) return next(new Err(401, 'Invalid session'))

            console.error(e)
            next(e)
        }
    },
    user: async (req, res, next) => {
        try {
            if (!req.user) return next(new Err(401, req.authError))

            res.res(new UserData(req.user))
        } catch (e) {
            console.error(e)
            next(e)
        }
    },
    logout: async (req, res, next) => {
        try {
            res.clearCookie('refresh_token')
            res.clearCookie('user')
            res.cookie('refresh_token', null, { maxAge: 0 })
            res.cookie('user', null, { maxAge: 0 })

            if (req.cookies.refresh_token) {
                let SelfToken = await RefreshToken.findOne({ token: req.cookies.refresh_token }).exec()

                if (SelfToken && SelfToken.status == 'active') {
                    SelfToken.status = 'deactivated';
                    SelfToken.save()

                    AccessToken.updateMany({ parent: SelfToken._id, status: 'active' }, { $set: { status: 'deactivated' } }).exec()
                }
            }

            res.res({ success: true })
        } catch (e) {
            console.error(e)
            next(e)
        }
    },
}

export { AuthController };