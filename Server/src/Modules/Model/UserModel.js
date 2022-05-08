import mongoose from 'mongoose'
import crypto from 'crypto'

import { GenerateToken } from '../Service/Utils.js'

/* Model of User in DB */
let UserSchema = new mongoose.Schema({
    name: { type: String, required: true, min: 3, max: 20, unique: true },              // Username
    role: { type: String, required: true, default: 'User' },                            // User role (User, Admin)
    password: { type: String, required: true },                                         // Password
    created_at: { type: Date, required: true, default: Date.now },                      // User creation date
    space_limit: { type: Number, required: true, default: 5 * 1024 * 1024 * 1024 },     // Total size of files limit
    space_used: { type: Number, required: true, default: 0 },
    salt: { type: String, required: true }
});

UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');

    this.password = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);

    return [this.salt, this.password];
}

UserSchema.methods.checkPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);

    return this.password === hash;
}

let User = mongoose.model('User', UserSchema);

/* Function, to generate random Access and Refresh tokens */
let _TokenCreate = () => GenerateToken(70);                                             

/* Model of Access Token in DB */
let AccessToken = mongoose.model('AccessToken', new mongoose.Schema({
    token: { type: String, required: true, default: _TokenCreate, unique: true },       
    status: { type: String, required: true, default: 'active' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    created_at: { type: Date, required: true, default: Date.now },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'RefreshToken', required: true }
}))

/* Model of Refresh Token in DB */
let RefreshToken = mongoose.model('RefreshToken', new mongoose.Schema({
    token: { type: String, required: true, default: _TokenCreate, unique: true },
    status: { type: String, required: true, default: 'active' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ip: { type: String },
    country: { type: String },
    useragent: { type: String },
    created_at: { type: Date, required: true, default: Date.now }
}))

export { User, AccessToken, RefreshToken }