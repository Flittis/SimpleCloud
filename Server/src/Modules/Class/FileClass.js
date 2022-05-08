export class FileData {
    _id;
    name;
    type;
    mimetype;
    md5;
    size;
    user;
    created_at;
    
    constructor(opt, isPrivate) {
        this._id = opt._id;
        this.name = opt.name;
        this.type = opt.type;
        this.mimetype = opt.mimetype;
        this.md5 = opt.md5;
        this.size = opt.size;
        this.user = opt.user;
        this.created_at = opt.created_at;

        if (isPrivate) {
            this.access = opt.access;
            this.parent = opt.parent;
            this.childs = opt.childs;
        }
    }
}