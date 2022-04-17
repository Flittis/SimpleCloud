export class UserData {
    _id;
    name;
    space_limit;
    space_used;

    constructor(opt) {
        this._id = opt._id;
        this.name = opt.name;
        this.space_limit = opt.space_limit;
        this.space_used = opt.space_used;
    }
}