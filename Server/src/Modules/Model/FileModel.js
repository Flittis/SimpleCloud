import mongoose from 'mongoose'

let File = mongoose.model('File', new mongoose.Schema({
    name: { type: String, required: true },
    path: { type: String, required: true },
    type: { type: String, required: true, default: 'file' },
    mimetype: { type: String },
    md5: { type: String },
    access: { 
        access_type: { type: String, required: true, default: 'public' },
        password: { type: String, default: undefined }
    },
    size: { type: Number, required: true, default: 0 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'File' },
    childs: [ { type: mongoose.Schema.Types.ObjectId, ref: 'File' } ],
    created_at: { type: Date, required: true, default: Date.now }
}))

export { File }