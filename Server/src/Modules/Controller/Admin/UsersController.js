import Err from '../../Service/ErrorService.js'

import { RefreshToken, User } from '../../Model/UserModel.js'
import { UserData } from '../../Class/UserClass.js'

import DateService from '../../Service/DateService.js'

let UsersController = {
    get: async (req, res, next) => {
        try {
            if (!req.user) return next(new Err(401, req.authError));
            if (req.user.role != 'Admin') return next(new Err(403, `You don't have access to this service`));

            let Query = {};

            if (req.query._id) Query._id = req.query._id;
            if (req.query.name) Query.name = new RegExp(req.query.name, 'gi');
            if (req.query.role) Query.role = req.query.role;
            if (req.query.createdAtDay) Query.created_at = {
                $gte: DateService.startOfDay(req.query.createdAtDay),
                $lte: DateService.endOfDay(req.query.createdAtDay)
            };

            let Response = await User.find(Query, null, { 
                limit: req.query.limit ? Number(req.query.limit) : 50, 
                skip: req.query.skip ? Number(req.query.skip) : 0, 
                sort: req.query.sort || 'created_at', 
            }).exec()

            Response = await Promise.all(Response.map( async _Resp => {
                let Resp = { ...new UserData(_Resp, false, true) };

                if (Response.length == 1 && req.query.extended == 'true') {
                    Resp.sessions = await RefreshToken.find({ status: 'active', user: _Resp._id }, 'ip useragent created_at', { sort: '-created_at' })
                }

                return Resp;
            }))

            res.res(Response)
        } catch (e) {
            console.error(e)
            next(e)
        }
    },
    update: async (req, res, next) => {
        try {
            if (!req.user) return next(new Err(401, req.authError))
            if (req.user.role != 'Admin') return next(new Err(403, `You don't have access to this service`))
            if (!req.query._id) return next(new Err(400, `User not defined`))
            if (!req.query.update) return next(new Err(400, `Update data not defined`))

            if (typeof req.query.update == 'string') {
                try {
                    let Parsed = JSON.parse(req.query.update)

                    if (!Object.keys(Parsed).length) throw 'Invalid update data';

                    req.query.update = Parsed;
                } catch(e) {
                    return next(new Err(404, `Invalid update data`))
                }
            }

            if (req.query.update.password) {
                const [salt, password] = req.user.setPassword(req.query.update.password)

                req.query.update.salt = salt;
                req.query.update.password = password;
            }

            let Response = await User.updateOne({ _id: req.query._id }, req.query.update)

            if (Response.matchedCount == 0) return next(new Err(404, `User not found`))

            res.res({ success: true })
        } catch (e) {
            console.error(e)
            next(e)
        }
    },
    remove: async (req, res, next) => {
        try {
            if (!req.user) return next(new Err(401, req.authError))
            if (req.user.role != 'Admin') return next(new Err(403, `You don't have access to this service`))
            if (!req.query._id) return next(new Err(400, `User not defined`))

            let Response = await User.deleteOne({ _id: req.query._id })

            if (Response.deletedCount == 0) return next(new Err(404, `User not found`))

            res.res({ success: true })
        } catch (e) {
            console.error(e)
            next(e)
        }
    },
}

export default UsersController;
