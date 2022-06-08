import { Router } from 'express'
import fileUpload from 'express-fileupload'
import Config from '../../Config.js'

import { CloudController } from '../Controller/CloudController.js'

let router = new Router()

router.get('/get', CloudController.get)
router.get('/download/:user/:id', CloudController.download)
router.post('/create', CloudController.create)
router.post('/update', CloudController.update)
router.post('/remove', CloudController.remove)
router.post('/upload', fileUpload({
    createParentPath: true,
    uploadTimeout: 30000,
    useTempFiles: true,
    tempFileDir: Config.TEMPFILEDIR,
    limits: { fileSize: 1 * 1024 * 1024 * 1024 },
    abortOnLimit: true,
    limitHandler: (_req, _res, next) => next(new Err(413, 'File is too big'))
}), CloudController.upload)

export default router;