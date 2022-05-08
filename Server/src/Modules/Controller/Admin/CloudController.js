import Config from '../../../Config.js'
import Err from '../../Service/ErrorService.js'

import fs from 'fs'

import DateService from '../../Service/DateService.js'
import { File } from '../../Model/FileModel.js'

let UsersController = {
    get: async (req, res, next) => {
        try {
            if (!req.user) return next(new Err(401, req.authError));
            if (req.user.role != 'Admin') return next(new Err(403, `You don't have access to this service`));

            let Query = {};

            if (req.query._id) Query._id = req.query._id
            if (req.query.name) Query.name = new RegExp(req.query.name, 'gi')
            if (req.query.parent) Query.parent = req.query.parent
            if (req.query.type) Query.type = req.query.type
            if (req.query.mimetype) Query.mimetype = req.query.mimetype
            if (req.query.createdAtDay)
                Query.created_at = {
                    $gte: DateService.startOfDay(req.query.createdAtDay),
                    $lte: DateService.endOfDay(req.query.createdAtDay),
                }

            let Response = await File.find(Query, null, {
                limit: req.query.limit ? Number(req.query.limit) : 50, 
                skip: req.query.skip ? Number(req.query.skip) : 0, 
                sort: req.query.sort || 'created_at', 
            }).populate('user parent').exec()

            res.res(Response || []);
        } catch (e) {
            console.error(e);
            next(e);
        }
    },
    remove: async (req, res, next) => {
        try {
            if (!req.user) return next(new Err(401, req.authError));
            if (req.user.role != 'Admin') return next(new Err(403, `You don't have access to this service`));
            if (!req.query._id) return next(new Err(400, `File not defined`));

            let Response = await File.findOne({ _id: req.query._id }).exec()
            if (!Response) return next(new Err(404, 'File not found'))
            // if (Response.type != 'file') return next(new Err(400, 'You can\'t remove this type of file'))
            
            await File.deleteOne({ _id: Response._id })

            if (Response.type == 'file') fs.unlinkSync(`${Config.STORAGEDIR}/${Response.user}/${Response.path}`)
            else if (Response.type == 'folder') fs.rmdirSync(`${Config.STORAGEDIR}/${Response.user}/${Response.path}`, { recursive: true });

            res.res({ success: true });
        } catch (e) {
            console.error(e);
            next(e);
        }
    },
}

export default UsersController;
