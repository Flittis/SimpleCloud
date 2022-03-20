import Config from './Config.js'

/* Libraries */

import express from 'express'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'

/* Settings */

let app = express();

app.disable('x-powered-by')
app.set('trust proxy', 'loopback')
app.use(express.json())
app.use(cookieParser())

/* HTTP Server Api */

app.all('/api/ping', (_req, res) => res.send({ response: { success: true } }));

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

Start();
