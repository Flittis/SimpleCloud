import { Router } from 'express'

import { AuthController } from '../Controller/AuthController.js'

let router = new Router()

router.post('/login', AuthController.login)
router.post('/register', AuthController.register)
router.post('/refresh', AuthController.refresh)
router.all('/logout', AuthController.logout)
router.get('/user', AuthController.user)

export default router;