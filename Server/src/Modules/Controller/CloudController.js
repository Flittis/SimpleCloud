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

            Query.user = req.user._id

            let Response = await File.find(Query, null, {
                sort: `-type ${req.query.sort || 'name'}`
            }).populate('parent').exec()

            res.res(Response || [])
        } catch (e) {
            if (e instanceof mongoose.CastError) return next(new Err(404, 'Not found'))

            console.error(e)
            next(e)
        }
    },
    update: async (req, res, next) => {
        try {
            if (!req.user) return next(new Err(401, req.authError))
            if (!req.query._id) return next(new Err(400, `File not defined`))
            if (!req.query.update) return next(new Err(400, `Update data not defined`))

            let Response = await File.findOne({ _id: req.query._id }).exec()

            if (!Response?._id) return next(new Err(400, `File not found`))
            if (Response.parent != req.user._id) return next(new Err(403))

            if (typeof req.query.update == 'string') {
                try {
                    let Parsed = JSON.parse(req.query.update)

                    req.query.update = Parsed
                } catch(e) {
                    return next(new Err(404, `Invalid update data`))
                }
            }

            let Update = {}, _Update = req.query.update;

            Update.access = Response.access || {}

            if (_Update.name) Update.name = _Update.name
            if (_Update.accessType) Update.access.access_type = _Update.accessType
            if (_Update.accessPasword) Update.access.password = _Update.accessPasword
            
            res.res({ success: true })
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
            if (Response.type === 'folder') return next(new Err(400, 'You can\'t download folder'))
            if (Response.type != 'file') return next(new Err(400, 'You can\'t download this type of file'))
            if (Response.access.type == 'private') return next(new Err(403))
            if (Response.access.password && (!req.query.password || Response.access.password != req.query.password)) {
                if (req.acceptHTML == true) {
                    res.set('Content-Type', 'text/html')
                    return res.status(403).sendFile('/Projekt_Zespolowy/Server/src/Modules/Views/PasswordValidate.html')
                } else return next(new Err(403))
            } 

            res.set('Content-Type', Response.mimetype)
            if (req.query.preview == 'true') {
                res.sendFile(
                    `${Config.STORAGEDIR}/${Response.user}/${Response.path}`,
                    { maxAge: 12 * 60 * 60 * 1000 },
                    (e) => (e ? next('Unable to download file') : '')
                )
            } else {
                res.download(
                    `${Config.STORAGEDIR}/${Response.user}/${Response.path}`,
                    Response.name.replace(/\s+/gi, '_'),
                    (e) => (e ? next('Unable to download file') : '')
                )
            }
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
            if (req.query.type && req.query.type != 'folder') return next(new Err(400, 'You can create only folder'))

            let _Parent, Path = '';

            let _newFile = new File({
                name: req.query.name,
                type: 'folder',
                user: req.user._id
            })

            if (req.query.parent) {
                _Parent = await File.findOne({ _id: req.query.parent }).exec().catch(e => console.error(e))

                if (_Parent?.type == 'folder') { 
                    _newFile.parent = _Parent._id
                    Path = _Parent.path
                }
            }

            _newFile.path = Path + `/${_newFile._id}`

            fs.mkdirSync(`${Config.STORAGEDIR}/${_newFile.user}/${_newFile.path}`)
            await _newFile.save()

            res.res({
                success: true,
                file: new FileData(_newFile)
            })

            if (_newFile.parent) {
                _Parent.childs.push(_newFile._id)
                _Parent.save()
            }
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

            await File.deleteOne({ _id: Response._id })

            if (Response.type == 'file') {
                fs.unlinkSync(`${Config.STORAGEDIR}/${Response.user}/${Response.path}`)
            } else if (Response.type == 'folder') {
                await File.deleteMany({ path: new RegExp(Response._id, 'gi') })
                fs.rmSync(`${Config.STORAGEDIR}/${Response.user}/${Response.path}`, { recursive: true, force: true })
            }

            res.res({ success: true })

            if (Response.parent) {
                let _Parent = await File.findOne({ _id: Response.parent }).exec().catch(e => console.error(e))

                if (_Parent?.type == 'folder') { 
                    _Parent.childs = _Parent.childs.filter(el => el.toString() != Response._id.toString())
                    _Parent.save()
                }
            }

            req.user.space_used = 0
            await File.find({ user: req.user._id }, 'size').exec()
                .then(r => r.map(r2 => req.user.space_used += r2.size))
            req.user.save()
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

            let FL = req.files.file, Path = '', _Parent;

            if (FL.size > req.user.space_limit - req.user.space_used) return next(new Err(400, 'You are exceeding the available space limit'))

            try {
                FL.name = decodeURIComponent(FL.name)
            } catch(e) {  }

            let _newFile = new File({ 
                name: FL.name,
                type: 'file',
                mimetype: FL.mimetype,
                md5: FL.md5,
                size: FL.size,
                user: req.user._id
            })

            if (req.query.parent) {
                _Parent = await File.findOne({ _id: req.query.parent }).exec().catch(e => console.error(e))

                if (_Parent?.type == 'folder') { 
                    _newFile.parent = _Parent._id
                    Path = _Parent.path
                }
            }

            _newFile.path = Path + `/${_newFile._id}.${FL.name.split('.').pop()}`

            FL.mv(`${Config.STORAGEDIR}/${req.user._id}${_newFile.path}`)
            await _newFile.save()

            res.res({ 
                success: true, 
                file: new FileData(_newFile)
            })

            req.user.space_used += _newFile.size
            req.user.save()

            if (_newFile.parent) {
                _Parent.childs.push(_newFile._id)
                _Parent.save()
            }
        } catch (e) {
            console.error(e)
            next(e)
        }
    },
}

export { CloudController };