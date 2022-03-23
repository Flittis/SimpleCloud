export class UserData {
    _id;
    name;
    files_limit;

    constructor(opt) {
        this._id = opt._id;
        this.name = opt.name;
        this.files_limit = opt.files_limit;
    }
}