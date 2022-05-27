import Config from '../../Config.js'
import Err from '../Service/ErrorService.js'

import mongoose from 'mongoose'
import fs from 'fs'

import DateService from '../Service/DateService.js'

import { File } from '../Model/FileModel.js'
import { FileData } from '../Class/FileClass.js'

let CloudController = {
    get: async (req, res, next) => {
        try {
            if (!req.user) return next(new Err(401, req.authError))

            let Query = {};

            if (req.query._id) Query._id = req.query._id
            if (req.query.name) Query.name = new RegExp(req.query.name, 'gi')
            if (req.query.parent) Query.parent = req.query.parent == 'undefined' ? { $exists: false } : req.query.parent
            if (req.query.type) Query.type = req.query.type
            if (req.query.mimetype) Query.mimetype = req.query.mimetype
            if (req.query.createdAtDay)
                Query.created_at = {
                    $gte: DateService.startOfDay(req.query.createdAtDay),
                    $lte: DateService.endOfDay(req.query.createdAtDay),
                }

            let Response = await File.find(Query, null, {
                sort: req.query.sort || 'name',
                user: req.user._id
            }).populate('parent').exec()

            res.res(Response || [])
        } catch (e) {
            if (e instanceof mongoose.CastError) return next(new Err(404, 'Not found'))

            console.error(e)
            next(e)
        }
    },
    download: async (req, res, next) => {
        try {
            if (!req.params.id || !req.params.user) return next(new Err(400, 'File not defined'))

            let Response = await File.findOne({ _id: req.params.id, user: req.params.user }).exec()
            if (!Response) return next(new Err(404, 'File not found'))
            if (Response.type != 'file') return next(new Err(400, 'You can\'t download this type of file'))

            res.set('Content-Type', Response.mimetype)
            res.download(
                `${Config.STORAGEDIR}/${Response.user}/${Response.path}`,
                Response.name.replace(/\s+/gi, '_'),
                (e) => (e ? next('Unable to download file') : '')
            )
        } catch (e) {
            if (e instanceof mongoose.CastError) return next(new Err(404, 'File not found'))
            
            console.error(e)
            next(e)
        }
    },
    create: async (req, res, next) => {
        try {
            if (!req.user) return next(new Err(401, req.authError))
            if (!req.query.name) return next(new Err(400, 'Folder name not defined'))

            if (req.query.type && req.query.type != 'folder') return next(new Err(400, 'You can\'t create this type of file'))

            let _newFile = new File({
                name: req.query.name,
                type: 'folder',
                user: req.user._id
            })

            _newFile.path = `/${_newFile._id}`;

            fs.mkdirSync(`${Config.STORAGEDIR}/${_newFile.user}/${_newFile.path}`)
            await _newFile.save()

            res.res({
                success: true,
                file: new FileData(_newFile)
            })
        } catch (e) {
            console.error(e)
            next(e)
        }
    },
    remove: async (req, res, next) => {
        try {
            if (!req.user) return next(new Err(401, req.authError))
            if (!req.query._id) return next(new Err(400, 'File id not defined'))
            
            let Response = await File.findOne({ _id: req.query._id }).exec()
            if (!Response) return next(new Err(404, 'File not found'))
            if (Response.type != 'file') return next(new Err(400, 'You can\'t remove this type of file'))
            
            await File.deleteOne({ _id: Response._id })
            fs.unlinkSync(`${Config.STORAGEDIR}/${Response.user}/${Response.path}`)

            res.res({ success: true })
        } catch (e) {
            if (e instanceof mongoose.CastError) return next(new Err(404, 'File not found'))
            if (e.code == 'ENOENT') return next('File not exist')

            console.error(e)
            next(e)
        }
    },
    upload: async (req, res, next) => {
        try {
            if (!req.user) return next(new Err(401, req.authError))
            if (!req?.files?.file?.mv) return next(new Err(400, 'Unable to upload file'))

            let FL = req.files.file;

            let _newFile = new File({ 
                name: FL.name,
                type: 'file',
                mimetype: FL.mimetype,
                md5: FL.md5,
                size: FL.size,
                user: req.user._id
            })

            _newFile.path = `/${_newFile._id}.${FL.name.split('.').pop()}`;

            FL.mv(`${Config.STORAGEDIR}/${req.user._id}${_newFile.path}`)
            await _newFile.save()

            res.res({ 
                success: true, 
                file: new FileData(_newFile)
            })
        } catch (e) {
            console.error(e)
            next(e)
        }
    },
}

export { CloudController };