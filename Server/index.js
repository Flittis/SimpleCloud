import Config from './Config.js'
import Err from './Modules/Service/ErrorService.js'

/* Libraries */

import express from 'express'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'

/* Routers */

import CloudRouter from './Modules/Router/CloudRouter.js'
import AuthRouter from './Modules/Router/AuthRouter.js'

/* Middlewares */

import CorsMiddleware from './Modules/Middleware/CorsMiddleware.js'
import UserMiddleware from './Modules/Middleware/UserMiddleware.js'
import ErrorMiddleware from './Modules/Middleware/ErrorMiddleware.js'

/* Settings */

let app = express()

app.disable('x-powered-by')
app.set('trust proxy', 'loopback')
app.use(express.json())
app.use(cookieParser())

/* HTTP Server Api */

app.all('/api/ping', (_req, res) => res.send({ response: { success: true } }))

app.use(CorsMiddleware)
app.use(UserMiddleware)
app.use('/api', CloudRouter)
app.use('/api/auth', AuthRouter)
app.use('*', (_req, _res, next) => next(new Err(404)))
app.use(ErrorMiddleware)

/* Starter */

const Start = async () => {
    try {
        await mongoose.connect(`${Config.DB_URL}`, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => console.log(`DB Connected to ${Config.DB_URL.replace(/(mongodb\:\/\/).+\@(.+)\/.+/gi, '$1$2')}`))

        app.listen(Config.SERVER_PORT,
            () => console.log(`HTTP Server started on ${Config.SERVER_URL}`))
    } catch (e) {
        console.error(e);
    }
}

Start()
