import Config from '../../Config.js';

import { createCipheriv } from 'crypto'

const { secretPass, passwordIv } = Config['CRYPTO'];

const EncryptPassword = async (data) => { return new Promise((resolve, reject) => {
    try {
        let cipher = createCipheriv('aes-256-cbc', Buffer.from(secretPass), passwordIv)
        let encrypted = cipher.update(data)
        encrypted = Buffer.concat([encrypted, cipher.final()])

        resolve(encrypted.toString('hex'))
    } catch (e) {
        reject(e);
    }
})}

export { EncryptPassword }