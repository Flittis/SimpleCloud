import { Router } from 'express'

import { UsersController, ServerController, CloudController } from '../Controller/Admin/index.js'

let router = new Router()

/* Server */

router.get('/server/data', ServerController.data)

/* Users */

router.get('/users/get', UsersController.get)
router.post('/users/update', UsersController.update)
router.post('/users/remove', UsersController.remove)

/* Cloud */

router.get('/cloud/get', CloudController.get)
router.post('/cloud/remove', CloudController.remove)

export default router;